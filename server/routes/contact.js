const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many submissions. Please wait before trying again.' },
});

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') return;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

// Public — submit contact form
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { fullName, email, organization, organizationName, executiveRole, jurisdiction, phone, phoneNumber, inquiryDetails } = req.body;
    const contact = await Contact.create({
      fullName: fullName || req.body.name,
      email,
      organizationName: organizationName || organization,
      executiveRole,
      jurisdiction,
      phoneNumber: phoneNumber || phone,
      inquiryDetails,
    });
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New Inquiry from ${contact.fullName}`,
      `<h2>New Contact Inquiry</h2>
       <p><strong>Name:</strong> ${contact.fullName}</p>
       <p><strong>Email:</strong> ${contact.email}</p>
       <p><strong>Organization:</strong> ${contact.organizationName}</p>
       <p><strong>Role:</strong> ${contact.executiveRole}</p>
       <p><strong>Jurisdiction:</strong> ${contact.jurisdiction}</p>
       <p><strong>Phone:</strong> ${contact.phoneNumber}</p>
       <p><strong>Inquiry:</strong> ${contact.inquiryDetails}</p>`
    );
    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin — list all contacts with optional status filter
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — stats summary
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, newCount, quoted, inProgress, won, lost] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'quoted' }),
      Contact.countDocuments({ status: 'in_progress' }),
      Contact.countDocuments({ status: 'won' }),
      Contact.countDocuments({ status: 'lost' }),
    ]);
    res.json({ total, new: newCount, quoted, in_progress: inProgress, won, lost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — CSV export
router.get('/export', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).lean();

    const escape = (val) => {
      if (val == null) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    };

    const headers = ['Name', 'Email', 'Organisation', 'Executive Role', 'Jurisdiction', 'Phone', 'Status', 'Inquiry Details', 'Notes', 'Submitted At'];
    const rows = contacts.map((c) => [
      escape(c.fullName),
      escape(c.email),
      escape(c.organizationName),
      escape(c.executiveRole),
      escape(c.jurisdiction),
      escape(c.phoneNumber),
      escape(c.status),
      escape(c.inquiryDetails),
      escape(c.notes),
      escape(c.createdAt ? new Date(c.createdAt).toISOString() : ''),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="inquiries.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — update contact (status, notes, etc.)
router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin — delete contact
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

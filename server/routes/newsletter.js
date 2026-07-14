const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const Subscriber = require('../models/Subscriber');
const Newsletter = require('../models/Newsletter');
const { protect } = require('../middleware/auth');

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Please wait before trying again.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const SITE_NAME = 'Solved Financial Services';

let transporter = null;
function getTransporter() {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
}

const sendEmail = async (to, subject, html) => {
  const t = getTransporter();
  if (!t) return;
  await t.sendMail({ from: `"${SITE_NAME}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`, to, subject, html });
};

const emailShell = (bodyHtml, unsubscribeUrl) => `
  <div style="font-family: Arial, sans-serif; background:#F5F7FA; padding:32px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:4px; overflow:hidden;">
      <div style="background:#001B2F; padding:24px 32px;">
        <span style="color:#D4B684; font-size:18px; font-weight:700; letter-spacing:0.05em;">${SITE_NAME}</span>
      </div>
      <div style="padding:32px; color:#001B2F; font-size:15px; line-height:1.6;">
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px; border-top:1px solid #eee; color:#546674; font-size:12px;">
        You are receiving this because you subscribed to updates from ${SITE_NAME}.
        <a href="${unsubscribeUrl}" style="color:#D4B684;">Unsubscribe</a>
      </div>
    </div>
  </div>
`;

// batch sender with small concurrency to avoid overwhelming SMTP
async function sendInBatches(subscribers, subject, content, batchSize = 8) {
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((sub) => {
        const unsubscribeUrl = `${CLIENT_URL}/unsubscribe/${sub.unsubscribeToken}`;
        return sendEmail(sub.email, subject, emailShell(content, unsubscribeUrl));
      })
    );
    results.forEach((r) => (r.status === 'fulfilled' ? sent++ : failed++));
  }
  return { sent, failed };
}

// ─── Public: subscribe ──────────────────────────────────────────────────────
router.post('/subscribe', subscribeLimiter, async (req, res) => {
  try {
    const { email, agreed } = req.body;
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (!agreed) {
      return res.status(400).json({ message: 'Please agree to receive newsletter updates.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let subscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (subscriber && subscriber.status === 'active') {
      return res.status(200).json({ message: 'You are already subscribed to our newsletter.' });
    }

    if (subscriber && subscriber.status === 'unsubscribed') {
      subscriber.status = 'active';
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = undefined;
      await subscriber.save();
    } else {
      subscriber = await Subscriber.create({ email: normalizedEmail });
    }

    const unsubscribeUrl = `${CLIENT_URL}/unsubscribe/${subscriber.unsubscribeToken}`;
    await sendEmail(
      subscriber.email,
      `Welcome to ${SITE_NAME} Newsletter`,
      emailShell(
        `<p>Thank you for subscribing to the ${SITE_NAME} newsletter.</p>
         <p>You'll now receive updates on regulatory changes, market insights, and company news directly in your inbox.</p>`,
        unsubscribeUrl
      )
    );

    res.status(201).json({ message: 'Thank you for subscribing! Please check your inbox.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: 'You are already subscribed to our newsletter.' });
    }
    res.status(400).json({ message: err.message });
  }
});

// ─── Public: unsubscribe ────────────────────────────────────────────────────
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const subscriber = await Subscriber.findOne({ unsubscribeToken: req.params.token });
    if (!subscriber) return res.status(404).json({ message: 'Subscription not found.' });

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({ message: 'You have been unsubscribed successfully.', email: subscriber.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Admin: subscriber list + stats ─────────────────────────────────────────
router.get('/subscribers', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/subscribers/stats', protect, async (req, res) => {
  try {
    const [total, active, unsubscribed] = await Promise.all([
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ status: 'active' }),
      Subscriber.countDocuments({ status: 'unsubscribed' }),
    ]);
    res.json({ total, active, unsubscribed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/subscribers/export', protect, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    const escape = (val) => {
      if (val == null) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    };
    const headers = ['Email', 'Status', 'Subscribed At'];
    const rows = subscribers.map((s) => [
      escape(s.email),
      escape(s.status),
      escape(s.subscribedAt ? new Date(s.subscribedAt).toISOString() : ''),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/subscribers/:id', protect, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Admin: newsletter CRUD ─────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { subject, content } = req.body;
    const newsletter = await Newsletter.create({ subject, content });
    res.status(201).json(newsletter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: 'Newsletter not found' });
    if (newsletter.status === 'sent') {
      return res.status(400).json({ message: 'Sent newsletters cannot be edited.' });
    }
    newsletter.subject = req.body.subject ?? newsletter.subject;
    newsletter.content = req.body.content ?? newsletter.content;
    await newsletter.save();
    res.json(newsletter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Newsletter deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Admin: send newsletter to all active subscribers ───────────────────────
router.post('/:id/send', protect, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: 'Newsletter not found' });
    if (newsletter.status === 'sent') {
      return res.status(400).json({ message: 'This newsletter has already been sent.' });
    }
    if (!getTransporter()) {
      return res.status(400).json({ message: 'Email service is not configured yet.' });
    }

    const subscribers = await Subscriber.find({ status: 'active' });
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'There are no active subscribers to send to.' });
    }

    newsletter.status = 'sending';
    await newsletter.save();

    const { sent, failed } = await sendInBatches(subscribers, newsletter.subject, newsletter.content);

    newsletter.status = 'sent';
    newsletter.sentAt = new Date();
    newsletter.recipientCount = sent;
    newsletter.failedCount = failed;
    await newsletter.save();

    res.json({ message: `Newsletter sent to ${sent} subscriber(s).`, newsletter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

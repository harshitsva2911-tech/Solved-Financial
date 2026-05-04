const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(admin._id), admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, (req, res) => res.json(req.admin));

router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Admin already exists' });
    const admin = await Admin.create(req.body);
    res.status(201).json({ token: signToken(admin._id), admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.matchPassword(currentPassword)))
      return res.status(401).json({ message: 'Current password is incorrect' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

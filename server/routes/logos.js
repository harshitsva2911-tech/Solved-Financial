const express = require('express');
const router = express.Router();
const Logo = require('../models/Logo');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const logos = await Logo.find({ active: true }).sort({ order: 1 });
    res.json(logos);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const logos = await Logo.find().sort({ order: 1 });
    res.json(logos);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const l = await Logo.create(req.body);
    res.status(201).json(l);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const l = await Logo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(l);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Logo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

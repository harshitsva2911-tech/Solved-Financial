const express = require('express');
const router = express.Router();
const Industry = require('../models/Industry');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const industries = await Industry.find({ active: true }).sort({ order: 1 });
    res.json(industries);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const industries = await Industry.find().sort({ order: 1 });
    res.json(industries);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const i = await Industry.create(req.body);
    res.status(201).json(i);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const i = await Industry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(i);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Industry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

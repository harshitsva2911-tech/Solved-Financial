const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const metrics = await Metric.find({ active: true }).sort({ order: 1 });
    res.json(metrics);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ order: 1 });
    res.json(metrics);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const m = await Metric.create(req.body);
    res.status(201).json(m);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const m = await Metric.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(m);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Metric.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

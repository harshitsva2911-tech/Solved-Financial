const express = require('express');
const router = express.Router();
const Jurisdiction = require('../models/Jurisdiction');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const j = await Jurisdiction.find({ active: true }).sort({ order: 1 });
    res.json(j);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const j = await Jurisdiction.findOne({ slug: req.params.slug, active: true });
    if (!j) return res.status(404).json({ message: 'Not found' });
    res.json(j);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const j = await Jurisdiction.find().sort({ order: 1 });
    res.json(j);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const j = await Jurisdiction.create(req.body);
    res.status(201).json(j);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const j = await Jurisdiction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(j);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Jurisdiction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

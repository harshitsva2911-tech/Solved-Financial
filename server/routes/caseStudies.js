const express = require('express');
const router = express.Router();
const CaseStudy = require('../models/CaseStudy');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const cs = await CaseStudy.find({ active: true }).sort({ order: 1 });
    res.json(cs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const cs = await CaseStudy.find().sort({ order: 1 });
    res.json(cs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const cs = await CaseStudy.create(req.body);
    res.status(201).json(cs);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const cs = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cs);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await CaseStudy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

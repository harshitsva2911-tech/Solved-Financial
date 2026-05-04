const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find({ active: true }).sort({ order: 1 });
    res.json(members);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json(members);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const m = await TeamMember.create(req.body);
    res.status(201).json(m);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const m = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(m);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

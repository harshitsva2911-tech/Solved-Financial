const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const s = await Service.create(req.body);
    res.status(201).json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

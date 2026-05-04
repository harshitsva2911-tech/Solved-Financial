const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', protect, async (req, res) => {
  try {
    const updates = req.body;
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: { filter: { key }, update: { $set: { key, value } }, upsert: true }
    }));
    await Setting.bulkWrite(ops);
    res.json({ message: 'Settings updated' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;

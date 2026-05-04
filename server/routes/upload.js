const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

async function resolveUrl(req, file) {
  if (upload.useS3) {
    const { uploadBuffer } = require('../utils/s3');
    const result = await uploadBuffer(file.buffer, file.originalname, file.mimetype);
    return { url: result.location, filename: result.key };
  }
  const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  return { url, filename: file.filename };
}

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const { url, filename } = await resolveUrl(req, req.file);
    res.json({ url, filename });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
});

router.post('/multiple', protect, upload.array('images', 10), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
  try {
    const results = await Promise.all(req.files.map((f) => resolveUrl(req, f)));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
});

module.exports = router;

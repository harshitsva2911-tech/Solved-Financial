const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

const useS3 = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME &&
  process.env.AWS_REGION
);

// Always buffer in memory; for local we write to disk in the route
const storage = useS3
  ? multer.memoryStorage()
  : (() => {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      return multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + path.extname(file.originalname));
        },
      });
    })();

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only document files (PDF, Word, Excel, PowerPoint) are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

router.get('/', protect, async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let url;
    if (useS3) {
      const { uploadBuffer } = require('../utils/s3');
      const result = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);
      url = result.location;
    } else {
      url = `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/${req.file.filename}`;
    }

    const doc = await Document.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      description: req.body.description || '',
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (useS3 && doc.url) {
      const { keyFromUrl, deleteFromS3 } = require('../utils/s3');
      const key = keyFromUrl(doc.url);
      if (key) await deleteFromS3(key).catch(() => {});
    } else if (doc.url) {
      const filename = doc.url.split('/uploads/').pop();
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await doc.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

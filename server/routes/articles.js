const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect } = require('../middleware/auth');

// Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 10, page = 1 } = req.query;
    const filter = { published: true };
    if (category && category !== 'All Insights') filter.category = category;
    if (featured === 'true') filter.featured = true;
    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      Article.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)),
      Article.countDocuments(filter)
    ]);
    res.json({ articles, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const related = await Article.find({ published: true, _id: { $ne: article._id } }).sort({ publishedAt: -1 }).limit(4);
    res.json({ article, related });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin
router.get('/admin/all', protect, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

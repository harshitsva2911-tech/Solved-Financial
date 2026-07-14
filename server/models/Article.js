const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  category: { type: String, enum: ['All Insights', 'Regulatory', 'Strategy', 'Markets', 'Technology'], default: 'All Insights' },
  tags: [String],
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  author: { type: String, default: 'Solved Financial Services' },
  readTime: { type: Number, default: 5 },
  publishedAt: { type: Date },
}, { timestamps: true });

articleSchema.index({ published: 1, publishedAt: -1 });
articleSchema.index({ published: 1, category: 1 });
articleSchema.index({ published: 1, featured: 1 });

articleSchema.pre('save', function () {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.published && !this.publishedAt) this.publishedAt = new Date();
});

module.exports = mongoose.model('Article', articleSchema);

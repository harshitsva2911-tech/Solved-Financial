const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  description: { type: String },
  image: { type: String },
  icon: { type: String },
  features: [String],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);

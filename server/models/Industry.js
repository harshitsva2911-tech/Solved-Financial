const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  challenges: [String],
  support: [String],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

industrySchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Industry', industrySchema);

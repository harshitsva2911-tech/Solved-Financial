const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  situation: { type: String },
  approach: { type: String },
  outcomes: [String],
  image: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

caseStudySchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('CaseStudy', caseStudySchema);

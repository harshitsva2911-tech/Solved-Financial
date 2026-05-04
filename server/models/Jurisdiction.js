const mongoose = require('mongoose');

const jurisdictionSchema = new mongoose.Schema({
  country: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  flagCode: { type: String },
  flagUrl: { type: String },
  heroImage: { type: String },
  tagline: { type: String },
  intro: { type: String },
  strategyPivot: {
    heading: String,
    points: [{ title: String, description: String }]
  },
  services: [{
    title: String,
    description: String,
    features: [String],
    image: String,
  }],
  partnerFirm: { name: String, description: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

jurisdictionSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Jurisdiction', jurisdictionSchema);

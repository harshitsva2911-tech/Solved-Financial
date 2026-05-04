const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

metricSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Metric', metricSchema);

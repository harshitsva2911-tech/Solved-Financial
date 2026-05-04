const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  url: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

logoSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Logo', logoSchema);

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  fileSize: { type: Number },
  mimeType: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);

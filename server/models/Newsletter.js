const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft', 'sending', 'sent'], default: 'draft' },
  sentAt: { type: Date },
  recipientCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
}, { timestamps: true });

newsletterSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);

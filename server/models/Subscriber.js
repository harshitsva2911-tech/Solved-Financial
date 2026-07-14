const mongoose = require('mongoose');
const crypto = require('crypto');

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
  unsubscribeToken: { type: String, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
}, { timestamps: true });

subscriberSchema.index({ status: 1 });

subscriberSchema.pre('save', function () {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(24).toString('hex');
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);

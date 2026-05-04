const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  organizationName: { type: String },
  executiveRole: { type: String },
  jurisdiction: { type: String },
  phoneNumber: { type: String },
  inquiryDetails: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'quoted', 'in_progress', 'won', 'lost', 'archived'],
    default: 'new',
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);

const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  linkedin: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

teamMemberSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);

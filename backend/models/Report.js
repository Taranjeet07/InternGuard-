const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  company: { type: String, required: true },
  recruiter: { type: String, required: false },
  url: { type: String, required: false },
  reason: { type: String, required: true },
  evidence: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);

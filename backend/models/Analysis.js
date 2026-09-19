const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({
  type: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  points: { type: Number, default: 0 },
  evidence: { type: String, required: true }
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  inputType: { type: String, enum: ['text', 'screenshot', 'url'], default: 'text' },
  inputText: { type: String, required: false },
  url: { type: String, required: false },
  company: { type: String, required: false },
  recruiterEmail: { type: String, required: false },
  website: { type: String, required: false },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['LOW', 'NEEDS_VERIFICATION', 'HIGH'], required: true },
  indicators: [indicatorSchema],
  explanation: { type: String, required: true },
  recommendedActions: [{ type: String }],
  aiAnalysisAvailable: { type: Boolean, default: false },
  verificationSignals: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);

const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
  clientIp: { type: String, required: true, unique: true },
  strikes: { type: Number, default: 0 },
  lockoutUntil: { type: Date, default: 0 },
  lastIncidentTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
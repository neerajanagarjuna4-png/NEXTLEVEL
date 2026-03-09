const mongoose = require('mongoose');

const studyReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  subject: String,
  topic: String,
  studyHours: Number,
  pyqsSolved: Number,
  mockTestScore: Number,
  accuracy: Number,
  difficulties: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one report per user per day
studyReportSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StudyReport', studyReportSchema);
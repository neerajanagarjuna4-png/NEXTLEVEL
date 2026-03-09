const mongoose = require('mongoose');

const syllabusProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: String,
    enum: ['ECE', 'EE', 'CSE'],
    required: true
  },
  progress: [{
    subjectIndex: Number,
    topicIndex: Number,
    subtopicIndex: Number,
    completed: Boolean,
    completedDate: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SyllabusProgress', syllabusProgressSchema);
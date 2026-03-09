const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    enum: ['ECE', 'EE', 'CSE'],
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: null
  },
  badges: [{
    name: String,
    earnedDate: Date
  }],
  targets: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 }
  },
  consistencyScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
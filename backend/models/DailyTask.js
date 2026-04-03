import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: Date, required: true },
  tasks: [{
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

// One task set per student per day
dailyTaskSchema.index({ userId: 1, date: 1 }, { unique: true });

// Default tasks for a new day
dailyTaskSchema.statics.DEFAULT_TASKS = [
  'Solve 25 PYQs',
  'Revise one subject',
  'Take a mock test',
  'Review mistakes',
  'Study new topic',
  'Practice numerical problems'
];

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);
export default DailyTask;

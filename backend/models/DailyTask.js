import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  tasks: [{
    id: String,
    name: String,
    completed: { type: Boolean, default: false }
  }],
  allCompleted: {
    type: Boolean,
    default: false
  }
});

dailyTaskSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);
export default DailyTask;

import mongoose from 'mongoose';

const dailyReflectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  morningMood: { type: String },
  morningGoal: { type: String, maxlength: 100 },
  estimatedHours: { type: Number },
  eveningActualHours: { type: Number },
  metGoal: { type: Boolean },
  learning: { type: String, maxlength: 500 },
  difficultyLevel: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const DailyReflection = mongoose.model('DailyReflection', dailyReflectionSchema);
export default DailyReflection;

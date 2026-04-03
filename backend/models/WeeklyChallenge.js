import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
});

const weeklyChallengeSchema = new mongoose.Schema({
  week: { type: String, required: true },
  title: { type: String, required: true },
  target: { type: Object },
  reward: { type: String },
  participants: [participantSchema],
  createdAt: { type: Date, default: Date.now }
});

const WeeklyChallenge = mongoose.model('WeeklyChallenge', weeklyChallengeSchema);
export default WeeklyChallenge;

import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalMockScore: { type: Number, default: 0 },
  latestMockScore: { type: Number, default: 0 },
  totalStudyHours: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

leaderboardSchema.index({ rank: 1 });
leaderboardSchema.index({ totalMockScore: -1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;

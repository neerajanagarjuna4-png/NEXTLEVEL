import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  subject: { type: String },
  status: { type: String, enum: ['correct', 'wrong', 'skipped', 'bookmarked'], required: true },
  attemptedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number, default: 0 }
});

const pyqProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  attempts: [attemptSchema],
  bookmarks: [{ type: String }]
});

const PYQProgress = mongoose.model('PYQProgress', pyqProgressSchema);
export default PYQProgress;

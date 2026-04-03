import mongoose from 'mongoose';

const streakFreezeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, trim: true, default: '' },
  approved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

streakFreezeSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    return next(new Error('endDate must be greater than or equal to startDate'));
  }
  next();
});

streakFreezeSchema.index({ userId: 1 });

const StreakFreeze = mongoose.model('StreakFreeze', streakFreezeSchema);
export default StreakFreeze;

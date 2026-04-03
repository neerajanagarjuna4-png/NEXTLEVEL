import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
  subject: { type: String, required: [true, 'Subject is required'], trim: true },
  activity: {
    type: String,
    required: [true, 'Activity is required'],
    enum: ['Video', 'Practice', 'Revision', 'Break', 'Apti', 'Other']
  },
  targetHours: { type: Number, default: 0, min: 0, max: 24 },
  actualHours: { type: Number, default: 0, min: 0, max: 24 },
  efficiency: { type: Number, min: 0, max: 100, default: 0 }
}, { _id: false });

const dailyTrackerLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  entries: {
    type: [EntrySchema],
    default: [],
    validate: {
      validator: (v) => !v || v.length <= 3,
      message: 'Entries array can have at most 3 items'
    }
  },
  totalEfficiency: { type: Number, min: 0, max: 100, default: 0 },
  mentorRemarks: { type: String, trim: true, default: '' },
  studentAnswers: { type: String, trim: true, default: '' },
  weeklyReview: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Auto-compute per-entry efficiency and overall totalEfficiency
dailyTrackerLogSchema.pre('save', function (next) {
  if (this.entries && this.entries.length) {
    this.entries.forEach(e => {
      const t = Number(e.targetHours || 0);
      const a = Number(e.actualHours || 0);
      e.efficiency = t > 0 ? Math.min(100, Number(((a / t) * 100).toFixed(2))) : (a > 0 ? 100 : 0);
    });
    const sum = this.entries.reduce((acc, e) => acc + (e.efficiency || 0), 0);
    this.totalEfficiency = Number((sum / this.entries.length).toFixed(2));
  } else {
    this.totalEfficiency = 0;
  }
  next();
});

// Unique log per user per date
dailyTrackerLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyTrackerLog = mongoose.model('DailyTrackerLog', dailyTrackerLogSchema);
export default DailyTrackerLog;

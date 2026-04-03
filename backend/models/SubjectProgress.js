import mongoose from 'mongoose';

const SUBJECTS = ['Networks', 'Digital', 'Signals', 'Controls', 'Maths', 'Apti', 'Analog', 'Emft', 'EDC', 'Commn'];

const subjectProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, enum: SUBJECTS, trim: true },
  videoTarget: { type: Number, default: 0, min: 0 },
  practiceTarget: { type: Number, default: 0, min: 0 },
  revisionTarget: { type: Number, default: 0, min: 0 },
  videoDone: { type: Number, default: 0, min: 0 },
  practiceDone: { type: Number, default: 0, min: 0 },
  revisionDone: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Virtual overall percent: (videoDone+practiceDone+revisionDone) / (videoTarget+practiceTarget+revisionTarget)
subjectProgressSchema.virtual('overallPercent').get(function () {
  const denom = (this.videoTarget || 0) + (this.practiceTarget || 0) + (this.revisionTarget || 0);
  if (!denom) return 0;
  const done = (this.videoDone || 0) + (this.practiceDone || 0) + (this.revisionDone || 0);
  return Number(((done / denom) * 100).toFixed(2));
});

subjectProgressSchema.set('toJSON', { virtuals: true });
subjectProgressSchema.set('toObject', { virtuals: true });

subjectProgressSchema.index({ userId: 1, subject: 1 }, { unique: true });

const SubjectProgress = mongoose.model('SubjectProgress', subjectProgressSchema);
export default SubjectProgress;

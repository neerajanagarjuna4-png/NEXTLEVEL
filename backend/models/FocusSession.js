import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  subject: { type: String, trim: true, default: 'General' },
  topic: { type: String, trim: true, default: 'General' },
  minutes: { type: Number, required: true, min: 1 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

focusSessionSchema.index({ userId: 1, date: 1 });

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);
export default FocusSession;

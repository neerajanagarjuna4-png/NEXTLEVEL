import mongoose from 'mongoose';

const questionAttemptSchema = new mongoose.Schema({
  questionId: String,
  selectedAnswer: mongoose.Schema.Types.Mixed,
  isCorrect: { type: Boolean, default: false },
  timeTaken: { type: Number, default: 0 }
});

const mockTestAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  testType: { type: String },
  subject: { type: String },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  questions: [questionAttemptSchema],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  subjectBreakdown: { type: Object }
});

const MockTestAttempt = mongoose.model('MockTestAttempt', mockTestAttemptSchema);
export default MockTestAttempt;

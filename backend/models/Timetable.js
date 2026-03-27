import mongoose from 'mongoose';

const dayTaskSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  subject: { type: String, default: '' },
  topic: { type: String, default: '' },
  targetHours: { type: Number, default: 0 },
  description: { type: String, default: '' },
  studentCompleted: { type: Boolean, default: false },
  studentCompletedAt: { type: Date, default: null },
  mentorCompleted: { type: Boolean, default: false }
});

const timetableSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStart: {
    type: Date,
    required: true
  },
  days: [dayTaskSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

timetableSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index so we can quickly fetch the latest timetable for a student
timetableSchema.index({ studentId: 1, weekStart: -1 });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;

import mongoose from 'mongoose';

const STEP_TITLES = [
  'Initial consultation and understanding your needs',
  'Identify Your Goal',
  'Fix the Resources',
  'Plan the Schedule',
  'Start Working',
  'Regular Feedback',
  'Weekly Zoom Call',
  'Continuous Monitoring'
];

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
});

const mentorshipStepSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  steps: [stepSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-populate default 8 steps on creation
mentorshipStepSchema.pre('save', function (next) {
  if (this.isNew && (!this.steps || this.steps.length === 0)) {
    this.steps = STEP_TITLES.map((title, i) => ({
      stepNumber: i + 1,
      title,
      completed: false,
      completedAt: null
    }));
  }
  this.updatedAt = new Date();
  next();
});

export const MENTORSHIP_STEP_TITLES = STEP_TITLES;
const MentorshipStep = mongoose.model('MentorshipStep', mentorshipStepSchema);
export default MentorshipStep;

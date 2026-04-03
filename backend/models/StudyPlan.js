import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  subject: { type: String },
  topics: [{ type: String }],
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  generatedAt: { type: Date, default: Date.now },
  targetDate: { type: Date },
  dailyPlans: [dailyPlanSchema],
  settings: {
    dailyHours: { type: Number, default: 4 },
    weakSubjects: [{ type: String }],
    strongSubjects: [{ type: String }]
  }
});

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;

import mongoose from 'mongoose';

const syllabusProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  branch: {
    type: String,
    enum: ['ECE', 'EE', 'CSE'],
    required: true
  },
  progress: [{
    subjectIndex: { type: Number, required: true },
    topicIndex: { type: Number, required: true },
    subtopicIndex: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date, default: null }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

// One progress record per student
syllabusProgressSchema.index({ userId: 1 }, { unique: true });

const SyllabusProgress = mongoose.model('SyllabusProgress', syllabusProgressSchema);
export default SyllabusProgress;
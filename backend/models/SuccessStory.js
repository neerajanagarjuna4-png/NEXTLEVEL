import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  branch: String,
  story: {
    type: String,
    required: true
  },
  imageUrl: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featName: String, // e.g., "AIR 50 in GATE"
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date
});

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
export default SuccessStory;

import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, maxlength: 200 },
  sentAt: { type: Date, default: Date.now }
});

const partnershipSchema = new mongoose.Schema({
  studentA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  checkIns: [checkInSchema]
});

const Partnership = mongoose.model('Partnership', partnershipSchema);
export default Partnership;

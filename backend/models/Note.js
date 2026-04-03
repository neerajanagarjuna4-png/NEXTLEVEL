import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String },
  topic: { type: String },
  content: { type: String },
  wordCount: { type: Number, default: 0 }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;

import mongoose from 'mongoose';

const cardProgressSchema = new mongoose.Schema({
  cardId: { type: String, required: true },
  nextReviewDate: { type: Date, default: Date.now },
  interval: { type: Number, default: 1 },
  easeFactor: { type: Number, default: 2.5 },
  repetitions: { type: Number, default: 0 },
  lastRating: { type: Number },
  lastReviewedAt: { type: Date }
});

const customCardSchema = new mongoose.Schema({
  front: String,
  back: String,
  subject: String,
  formula: String,
  createdAt: { type: Date, default: Date.now }
});

const flashcardProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cards: [cardProgressSchema],
  customCards: [customCardSchema]
});

const FlashcardProgress = mongoose.model('FlashcardProgress', flashcardProgressSchema);
export default FlashcardProgress;

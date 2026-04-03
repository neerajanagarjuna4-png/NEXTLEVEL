import express from 'express';
import { protect } from '../middleware/auth.js';
import { getDueFlashcards, reviewCard, addCustomCard, getFlashcardProgress, getCardsList } from '../controllers/flashcardController.js';

const router = express.Router();

router.get('/list', protect, getCardsList);
router.get('/due', protect, getDueFlashcards);
router.post('/review', protect, reviewCard);
router.post('/custom', protect, addCustomCard);
router.get('/progress', protect, getFlashcardProgress);

export default router;

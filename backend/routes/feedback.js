import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import { addFeedback, getFeedbackForStudent } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', protect, mentorOnly, addFeedback);
router.get('/:studentId', protect, getFeedbackForStudent);

export default router;

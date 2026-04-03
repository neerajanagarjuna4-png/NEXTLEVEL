import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import { startTest, submitTest } from '../controllers/mockTestController.js';

const router = express.Router();

router.post('/start', protect, startTest);
router.post('/submit', protect, submitTest);

export default router;

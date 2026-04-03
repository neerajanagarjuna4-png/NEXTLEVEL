import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import { createChallenge, getCurrentChallenge, updateParticipant } from '../controllers/weeklyChallengeController.js';

const router = express.Router();

router.post('/', protect, mentorOnly, createChallenge);
router.get('/current', protect, getCurrentChallenge);
router.post('/join', protect, updateParticipant);

export default router;

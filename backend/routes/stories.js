import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import {
  submitStory,
  getApprovedStories,
  getPendingStories,
  approveStory,
  rejectStory
} from '../controllers/storyController.js';

const router = express.Router();

// Public
router.get('/approved', getApprovedStories);

// Student
router.post('/', protect, submitStory);

// Mentor
router.get('/pending', protect, mentorOnly, getPendingStories);
router.put('/:id/approve', protect, mentorOnly, approveStory);
router.put('/:id/reject', protect, mentorOnly, rejectStory);

export default router;

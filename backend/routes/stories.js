import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import {
  createStory,
  getStories,
  getStory,
  toggleLike,
  addComment,
  deleteComment,
  approveStory,
  deleteStory
} from '../controllers/storyController.js';

const router = express.Router();

// Public: list approved (but getStories handles role logic)
router.get('/', protect, getStories);
router.get('/:storyId', protect, getStory);

// Create story (student)
router.post('/', protect, createStory);

// Like toggle
router.put('/:storyId/like', protect, toggleLike);

// Comments
router.post('/:storyId/comment', protect, addComment);
router.delete('/:storyId/comment/:commentId', protect, deleteComment);

// Mentor actions
router.put('/:storyId/approve', protect, mentorOnly, approveStory);

// Delete (owner or mentor)
router.delete('/:storyId', protect, deleteStory);

export default router;

import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import {
  createQuery,
  getStudentQueries,
  getPendingQueries,
  getAllQueries,
  answerQuery,
  resolveQuery
} from '../controllers/queryController.js';

const router = express.Router();

// Student routes
router.post('/', protect, createQuery);
router.get('/student', protect, getStudentQueries);
router.put('/:id/resolve', protect, resolveQuery);

// Mentor routes
router.get('/mentor/pending', protect, mentorOnly, getPendingQueries);
router.get('/mentor/all', protect, mentorOnly, getAllQueries);
router.put('/:id/answer', protect, mentorOnly, answerQuery);

export default router;

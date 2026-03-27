import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMetrics,
  updateTargets,
  submitReport,
  getReports,
  updateStreak,
  getSyllabusProgress,
  updateSyllabusProgress,
  bulkUpdateSyllabusProgress,
  getDailyTasks,
  updateDailyTasks
} from '../controllers/studentController.js';

const router = express.Router();

// Metrics (Issue #1)
router.get('/metrics/:userId', protect, getMetrics);
router.post('/targets', protect, updateTargets);

// Study Reports
router.post('/report', protect, submitReport);
router.get('/reports/:userId', protect, getReports);

// Streaks (Issue #2)
router.post('/streak', protect, updateStreak);

// Syllabus Progress (Issue #3)
router.get('/syllabus-progress/:userId', protect, getSyllabusProgress);
router.post('/syllabus-progress', protect, updateSyllabusProgress);
router.post('/syllabus-progress/bulk', protect, bulkUpdateSyllabusProgress);

// Daily Tasks (Issue #4)
router.get('/daily-tasks/:date', protect, getDailyTasks);
router.put('/daily-tasks/:date', protect, updateDailyTasks);

export default router;

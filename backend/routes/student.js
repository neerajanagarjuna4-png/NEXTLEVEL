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
  updateDailyTasks,
  getTimetable,
  markTimetableDayComplete,
  getLeaderboard,
  getMentorshipSteps
} from '../controllers/studentController.js';

const router = express.Router();

// Metrics
router.get('/metrics/:userId', protect, getMetrics);
router.post('/targets', protect, updateTargets);

// Study Reports
router.post('/report', protect, submitReport);
router.get('/reports/:userId', protect, getReports);

// Streaks
router.post('/streak', protect, updateStreak);

// Syllabus Progress
router.get('/syllabus-progress/:userId', protect, getSyllabusProgress);
router.post('/syllabus-progress', protect, updateSyllabusProgress);
router.post('/syllabus-progress/bulk', protect, bulkUpdateSyllabusProgress);

// Daily Tasks
router.get('/daily-tasks/:date', protect, getDailyTasks);
router.put('/daily-tasks/:date', protect, updateDailyTasks);

// Timetable (student side)
router.get('/timetable', protect, getTimetable);
router.post('/timetable-complete', protect, markTimetableDayComplete);

// Leaderboard
router.get('/leaderboard', protect, getLeaderboard);

// Mentorship Steps (read-only for student)
router.get('/mentorship-steps', protect, getMentorshipSteps);

export default router;

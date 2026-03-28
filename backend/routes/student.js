import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  getTargets, updateTargets,
  getProgress,
  createStudyReport, getStudyReports,
  getSyllabusProgress, updateSyllabusProgress,
  getDailyTasks, updateDailyTasks,
  getStreak, getRewards,
  getTimetable, markTimetableComplete, getJourney
} from '../controllers/studentController.js';

const router = Router();

// All student routes require auth + student role
router.use(requireAuth);
router.use(requireRole(['student']));

// Targets
router.get('/targets/:userId', getTargets);
router.post('/targets/:userId', updateTargets);

// Progress (aggregated study hours)
router.get('/progress/:userId', getProgress);

// Study Reports
router.post('/study-report', createStudyReport);
router.get('/study-reports/:userId', getStudyReports);

// Syllabus Progress
router.get('/syllabus-progress/:userId', getSyllabusProgress);
router.post('/syllabus-progress/:userId', updateSyllabusProgress);

// Daily Tasks
router.get('/daily-tasks/:userId', getDailyTasks);
router.post('/daily-tasks/:userId', updateDailyTasks);

// Streak & Rewards
router.get('/streak/:userId', getStreak);
router.get('/rewards/:userId', getRewards);

// Timetable & Journey (read-only for students)
router.get('/timetable/:userId', getTimetable);
router.post('/timetable-complete/:userId', markTimetableComplete);
router.get('/journey/:userId', getJourney);

export default router;

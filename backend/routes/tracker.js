import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getTrackerLogs,
  upsertTrackerLog,
  getSubjectProgress,
  updateSubjectProgress,
  getReports
} from '../controllers/trackerController.js';

const router = Router();

// Daily log routes
router.get('/logs', requireAuth, getTrackerLogs);
router.post('/logs', requireAuth, upsertTrackerLog);

// Subject progress routes
router.get('/subjects', requireAuth, getSubjectProgress);
router.put('/subjects', requireAuth, updateSubjectProgress);

// Reports
router.get('/reports', requireAuth, getReports);

export default router;

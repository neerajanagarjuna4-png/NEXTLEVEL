import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  getPendingStudents, approveStudent, rejectStudent,
  getApprovedStudents, getStudentDetail,
  setTimetable, updateJourneyStep
} from '../controllers/mentorController.js';

const router = Router();

// All mentor routes require auth + mentor role
router.use(requireAuth);
router.use(requireRole(['mentor']));

// Student management
router.get('/pending-students', getPendingStudents);
router.post('/approve-student/:userId', approveStudent);
router.post('/reject-student/:userId', rejectStudent);

// Approved students with stats
router.get('/approved-students', getApprovedStudents);
router.get('/student-detail/:userId', getStudentDetail);

// Timetable & Journey management
router.post('/timetable/:userId', setTimetable);
router.post('/journey/:userId', updateJourneyStep);

export default router;

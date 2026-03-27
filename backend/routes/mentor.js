import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import {
  getStudents,
  getApprovedStudents,
  approveStudent,
  rejectStudent,
  getStudentReports
} from '../controllers/mentorController.js';

const router = express.Router();

router.get('/students', protect, mentorOnly, getStudents);
router.get('/students/approved', protect, mentorOnly, getApprovedStudents);
router.put('/students/:id/approve', protect, mentorOnly, approveStudent);
router.put('/students/:id/reject', protect, mentorOnly, rejectStudent);
router.get('/student/:id/reports', protect, mentorOnly, getStudentReports);

export default router;

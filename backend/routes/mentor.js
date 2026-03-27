import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import {
  getStudents,
  getApprovedStudents,
  approveStudent,
  rejectStudent,
  getStudentReports,
  getStudentDetail,
  createOrUpdateTimetable,
  getStudentTimetable,
  updateMentorshipSteps
} from '../controllers/mentorController.js';

const router = express.Router();

// Student lists
router.get('/students', protect, mentorOnly, getStudents);
router.get('/students/approved', protect, mentorOnly, getApprovedStudents);

// Approve / Reject
router.put('/students/:id/approve', protect, mentorOnly, approveStudent);
router.put('/students/:id/reject', protect, mentorOnly, rejectStudent);

// Student detail & reports
router.get('/student/:id/reports', protect, mentorOnly, getStudentReports);
router.get('/student/:id/detail', protect, mentorOnly, getStudentDetail);

// Timetable management
router.post('/timetable/:studentId', protect, mentorOnly, createOrUpdateTimetable);
router.get('/timetable/:studentId', protect, mentorOnly, getStudentTimetable);

// Mentorship steps
router.post('/step/:studentId', protect, mentorOnly, updateMentorshipSteps);

export default router;

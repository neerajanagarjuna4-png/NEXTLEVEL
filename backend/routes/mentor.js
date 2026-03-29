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

// ─── Combined students list (pending + approved) ────────────
// Frontend calls GET /api/mentor/students
router.get('/students', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const students = await User.find({ role: 'student' })
      .select('name email branch status streak consistencyScore badges lastActiveDate createdAt')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error('GET /mentor/students error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
});

// ─── Approve / Reject (frontend uses PUT /students/:id/approve) ─
router.put('/students/:userId/approve', approveStudent);
router.put('/students/:userId/reject', rejectStudent);

// ─── Also support the original POST routes ──────────────────
router.post('/approve-student/:userId', approveStudent);
router.post('/reject-student/:userId', rejectStudent);

// ─── Student detail ─────────────────────────────────────────
// Frontend calls GET /api/mentor/student/:id/detail
router.get('/student/:userId/detail', getStudentDetail);
router.get('/student-detail/:userId', getStudentDetail); // alias

// ─── Student reports (used as fallback in frontend) ─────────
router.get('/student/:userId/reports', async (req, res) => {
  try {
    const StudyReport = (await import('../models/StudyReport.js')).default;
    const reports = await StudyReport.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(30);
    res.json(reports);
  } catch (err) {
    console.error('GET /mentor/student/:id/reports error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
});

// ─── Mentorship steps (journey) ─────────────────────────────
// Frontend calls POST /api/mentor/step/:id with { steps: [...] }
router.post('/step/:userId', async (req, res) => {
  try {
    const MentorshipStep = (await import('../models/MentorshipStep.js')).default;
    const { steps } = req.body;
    
    let doc = await MentorshipStep.findOne({ studentId: req.params.userId });
    if (!doc) {
      doc = new MentorshipStep({ studentId: req.params.userId });
      await doc.save(); // triggers pre-save hook to create default steps
    }

    // Update each step's completed status
    if (Array.isArray(steps)) {
      for (const update of steps) {
        const existing = doc.steps.find(s => s.stepNumber === update.stepNumber);
        if (existing) {
          existing.completed = !!update.completed;
          existing.completedAt = update.completed ? new Date() : null;
        }
      }
      await doc.save();
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('journey-updated', { userId: req.params.userId, steps: doc.steps });
    }

    res.json({ success: true, steps: doc.steps });
  } catch (err) {
    console.error('POST /mentor/step/:id error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
});

// ─── Pending/Approved (original routes) ─────────────────────
router.get('/pending-students', getPendingStudents);
router.get('/approved-students', getApprovedStudents);

// ─── Timetable & Journey management ────────────────────────
router.post('/timetable/:userId', setTimetable);
router.post('/journey/:userId', updateJourneyStep);

export default router;

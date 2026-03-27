import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
import Timetable from '../models/Timetable.js';
import MentorshipStep from '../models/MentorshipStep.js';
import SyllabusProgress from '../models/SyllabusProgress.js';
import { sendApprovalEmail } from '../services/emailService.js';

// GET /api/mentor/students - Get all students (Issue #6: unique, no duplicates)
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });

    // Ensure uniqueness by email (Issue #6)
    const seen = new Set();
    const uniqueStudents = students.filter(s => {
      if (seen.has(s.email)) return false;
      seen.add(s.email);
      return true;
    });

    res.json(uniqueStudents);
  } catch (error) {
    console.error('getStudents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/mentor/students/approved
export const getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', status: 'approved' })
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });

    // Add computed data for each student
    const enrichedStudents = await Promise.all(students.map(async (student) => {
      const reportCount = await StudyReport.countDocuments({ userId: student._id });
      const latestReport = await StudyReport.findOne({ userId: student._id }).sort({ date: -1 });

      return {
        ...student.toObject(),
        reportCount,
        lastReportDate: latestReport?.date || null
      };
    }));

    res.json(enrichedStudents);
  } catch (error) {
    console.error('getApprovedStudents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/mentor/students/:id/approve
export const approveStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send approval email
    await sendApprovalEmail(user.email, user.name);

    res.json({ message: 'Student approved', user });
  } catch (error) {
    console.error('approveStudent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/mentor/students/:id/reject
export const rejectStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student rejected', user });
  } catch (error) {
    console.error('rejectStudent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/mentor/student/:id/reports
export const getStudentReports = async (req, res) => {
  try {
    const reports = await StudyReport.find({ userId: req.params.id })
      .sort({ date: -1 })
      .limit(100);
    res.json(reports);
  } catch (error) {
    console.error('getStudentReports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/mentor/student/:id/detail - Full student detail with enriched data
export const getStudentDetail = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const [reports, timetable, steps, syllabusProgress] = await Promise.all([
      StudyReport.find({ userId: student._id }).sort({ date: -1 }).limit(50),
      Timetable.findOne({ studentId: student._id }).sort({ weekStart: -1 }),
      MentorshipStep.findOne({ studentId: student._id }),
      SyllabusProgress.find({ userId: student._id })
    ]);

    res.json({
      student,
      reports,
      timetable: timetable || null,
      steps: steps ? steps.steps : [],
      syllabusProgress
    });
  } catch (error) {
    console.error('getStudentDetail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/mentor/timetable/:studentId - Create or update weekly timetable
export const createOrUpdateTimetable = async (req, res) => {
  try {
    const { weekStart, days } = req.body;
    const { studentId } = req.params;

    if (!weekStart || !days || !Array.isArray(days)) {
      return res.status(400).json({ message: 'weekStart and days array are required' });
    }

    const weekStartDate = new Date(weekStart);

    let timetable = await Timetable.findOne({
      studentId,
      weekStart: { $gte: new Date(weekStartDate.setHours(0, 0, 0, 0)) }
    });

    if (timetable) {
      timetable.days = days;
      timetable.updatedAt = new Date();
      await timetable.save();
    } else {
      timetable = new Timetable({ studentId, weekStart: new Date(weekStart), days });
      await timetable.save();
    }

    res.json({ success: true, timetable });
  } catch (error) {
    console.error('createOrUpdateTimetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/mentor/timetable/:studentId - Fetch student's latest timetable
export const getStudentTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ studentId: req.params.studentId }).sort({ weekStart: -1 });
    res.json({ timetable: timetable || null });
  } catch (error) {
    console.error('getStudentTimetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/mentor/step/:studentId - Update mentorship steps for a student
export const updateMentorshipSteps = async (req, res) => {
  try {
    const { steps } = req.body;
    const { studentId } = req.params;

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: 'steps array is required' });
    }

    let record = await MentorshipStep.findOne({ studentId });

    if (!record) {
      record = new MentorshipStep({ studentId });
    }

    // Merge incoming step completions
    record.steps = record.steps.map(existingStep => {
      const update = steps.find(s => s.stepNumber === existingStep.stepNumber);
      if (update) {
        return {
          ...existingStep.toObject(),
          completed: update.completed,
          completedAt: update.completed && !existingStep.completedAt ? new Date() : existingStep.completedAt
        };
      }
      return existingStep;
    });

    await record.save();
    res.json({ success: true, steps: record.steps });
  } catch (error) {
    console.error('updateMentorshipSteps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

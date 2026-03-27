import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
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

import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
import SyllabusProgress from '../models/SyllabusProgress.js';
import DailyTask from '../models/DailyTask.js';
import DailyTrackerLog from '../models/DailyTrackerLog.js';
import { sendApprovalEmail } from '../services/emailService.js';

// ─── GET /api/mentor/pending-students ──────────────────────
export const getPendingStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', status: 'pending' })
      .select('name email branch createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: students.length, students });
  } catch (err) {
    console.error('getPendingStudents error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── POST /api/mentor/approve-student/:userId ──────────────
export const approveStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });
    if (user.role !== 'student') return res.status(400).json({ error: true, message: 'Can only approve students.' });
    if (user.status === 'approved') return res.status(400).json({ error: true, message: 'Student already approved.' });

    user.status = 'approved';
    await user.save();

    // Emit approval event
    const io = req.app.get('io');
    if (io) {
      io.emit('student-approved', { userId: user._id, name: user.name });
    }

    // Send approval email (non-blocking)
    sendApprovalEmail({ name: user.name, email: user.email }).catch(err =>
      console.error('Approval email failed:', err.message)
    );

    res.json({ success: true, message: `${user.name} has been approved.`, user: { _id: user._id, name: user.name, status: user.status } });
  } catch (err) {
    console.error('approveStudent error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── POST /api/mentor/reject-student/:userId ───────────────
export const rejectStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    user.status = 'rejected';
    await user.save();

    res.json({ success: true, message: `${user.name} has been rejected.` });
  } catch (err) {
    console.error('rejectStudent error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── GET /api/mentor/approved-students ─────────────────────
// Returns list with computed stats per student
export const getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', status: 'approved' })
      .select('name email branch streak consistencyScore badges lastActiveDate createdAt')
      .sort({ name: 1 });

    // Compute additional live stats per student
    const enriched = await Promise.all(students.map(async (student) => {
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setUTCHours(0, 0, 0, 0);

      // Count total reports
      const reportCount = await StudyReport.countDocuments({ userId: student._id });

      // Total study hours (all time)
      const totalAgg = await StudyReport.aggregate([
        { $match: { userId: student._id } },
        { $group: { _id: null, total: { $sum: '$studyHours' } } }
      ]);

      // Today's report
      const todayReport = await StudyReport.findOne({
        userId: student._id,
        date: { $gte: startOfToday }
      });

      // At-risk check: no report in 3+ days
      const lastReport = await StudyReport.findOne({ userId: student._id }).sort({ date: -1 });
      const daysSinceLastReport = lastReport
        ? Math.round((now - lastReport.date) / (1000 * 60 * 60 * 24))
        : reportCount === 0 ? 999 : 0;

      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        branch: student.branch,
        streak: student.streak,
        consistencyScore: student.consistencyScore,
        badges: student.badges,
        lastActiveDate: student.lastActiveDate,
        createdAt: student.createdAt,
        totalStudyHours: totalAgg[0]?.total || 0,
        reportCount,
        hasReportedToday: !!todayReport,
        daysSinceLastReport,
        atRisk: daysSinceLastReport >= 3
      };
    }));

    // Stats summary
    const totalApproved = enriched.length;
    const eceBranch = enriched.filter(s => s.branch === 'ECE').length;
    const eeBranch = enriched.filter(s => s.branch === 'EE').length;
    const cseBranch = enriched.filter(s => s.branch === 'CSE').length;
    const atRiskCount = enriched.filter(s => s.atRisk).length;

    res.json({
      success: true,
      stats: { totalApproved, eceBranch, eeBranch, cseBranch, atRiskCount },
      students: enriched
    });
  } catch (err) {
    console.error('getApprovedStudents error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── GET /api/mentor/student-detail/:userId ────────────────
// Full student data with all aggregated stats
export const getStudentDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setUTCHours(0, 0, 0, 0);
    const startOfWeekDate = getStartOfWeek(now);
    const startOfMonthDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);

    // Aggregate study data
    const [todayAgg, weekAgg, monthAgg, allTimeAgg] = await Promise.all([
      StudyReport.aggregate([
        { $match: { userId: user._id, date: { $gte: startOfToday } } },
        { $group: { _id: null, hours: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, acc: { $avg: '$accuracy' } } }
      ]),
      StudyReport.aggregate([
        { $match: { userId: user._id, date: { $gte: startOfWeekDate } } },
        { $group: { _id: null, hours: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, acc: { $avg: '$accuracy' } } }
      ]),
      StudyReport.aggregate([
        { $match: { userId: user._id, date: { $gte: startOfMonthDate } } },
        { $group: { _id: null, hours: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, acc: { $avg: '$accuracy' } } }
      ]),
      StudyReport.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: null, hours: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, acc: { $avg: '$accuracy' }, reports: { $sum: 1 } } }
      ])
    ]);

    // Recent reports
    const recentReports = await StudyReport.find({ userId: user._id }).sort({ date: -1 }).limit(14);

    // Syllabus progress
    const syllabusProgress = await SyllabusProgress.findOne({ userId: user._id });
    let syllabusPercentage = 0;
    if (syllabusProgress) {
      const total = syllabusProgress.progress.length;
      const done = syllabusProgress.progress.filter(p => p.completed).length;
      syllabusPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
    }

    // Today's tasks
    const todayTasks = await DailyTask.findOne({ userId: user._id, date: { $gte: startOfToday } });

    res.json({
      success: true,
      student: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        streak: user.streak,
        consistencyScore: user.consistencyScore,
        badges: user.badges,
        targets: user.targets,
        timetable: user.timetable,
        journeySteps: user.journeySteps,
        createdAt: user.createdAt
      },
      aggregated: {
        today: { hours: todayAgg[0]?.hours || 0, pyqs: todayAgg[0]?.pyqs || 0, accuracy: Math.round(todayAgg[0]?.acc || 0) },
        week: { hours: weekAgg[0]?.hours || 0, pyqs: weekAgg[0]?.pyqs || 0, accuracy: Math.round(weekAgg[0]?.acc || 0) },
        month: { hours: monthAgg[0]?.hours || 0, pyqs: monthAgg[0]?.pyqs || 0, accuracy: Math.round(monthAgg[0]?.acc || 0) },
        allTime: { hours: allTimeAgg[0]?.hours || 0, pyqs: allTimeAgg[0]?.pyqs || 0, accuracy: Math.round(allTimeAgg[0]?.acc || 0), reports: allTimeAgg[0]?.reports || 0 }
      },
      recentReports,
      syllabusPercentage,
      todayTasks: todayTasks?.tasks || []
    });
  } catch (err) {
    console.error('getStudentDetail error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── GET /api/mentor/student/:userId/tracker ───────────────
export const getStudentTracker = async (req, res) => {
  try {
    const logs = await DailyTrackerLog.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json({ success: true, logs });
  } catch (err) {
    console.error('getStudentTracker error:', err);
    res.status(500).json({ error: true, message: 'Server error fetching tracker logs.' });
  }
};

// ─── POST /api/mentor/timetable/:userId ────────────────────
export const setTimetable = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    const { timetable } = req.body;
    if (!Array.isArray(timetable)) {
      return res.status(400).json({ error: true, message: 'timetable must be an array of { day, subjects, targetHours }.' });
    }

    user.timetable = timetable;
    await user.save();

    res.json({ success: true, message: 'Timetable updated.', timetable: user.timetable });
  } catch (err) {
    console.error('setTimetable error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── POST /api/mentor/journey/:userId ──────────────────────
export const updateJourneyStep = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    const { stepName, completed } = req.body;
    if (!stepName) return res.status(400).json({ error: true, message: 'stepName is required.' });

    const step = user.journeySteps.find(s => s.name === stepName);
    if (!step) return res.status(400).json({ error: true, message: `Step "${stepName}" not found.` });

    step.completed = !!completed;
    step.completedDate = completed ? new Date() : null;
    await user.save();

    res.json({ success: true, journeySteps: user.journeySteps });
  } catch (err) {
    console.error('updateJourneyStep error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// Helper
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

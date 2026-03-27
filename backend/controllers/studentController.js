import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
import SyllabusProgress from '../models/SyllabusProgress.js';
import DailyTask from '../models/DailyTask.js';

// ──────────────────────────────────────────────
// METRICS (Issue #1)
// ──────────────────────────────────────────────

// GET /api/student/metrics/:userId
export const getMetrics = async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    // Today's start (midnight)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // This week's Monday
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - mondayOffset);

    // This month's first day
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate daily hours
    const [dailyResult] = await StudyReport.aggregate([
      { $match: { userId: userId, date: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: '$studyHours' } } }
    ]);

    const [weeklyResult] = await StudyReport.aggregate([
      { $match: { userId: userId, date: { $gte: weekStart } } },
      { $group: { _id: null, total: { $sum: '$studyHours' } } }
    ]);

    const [monthlyResult] = await StudyReport.aggregate([
      { $match: { userId: userId, date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$studyHours' } } }
    ]);

    const user = await User.findById(userId).select('targets streak badges consistencyScore');

    res.json({
      daily: dailyResult?.total || 0,
      weekly: weeklyResult?.total || 0,
      monthly: monthlyResult?.total || 0,
      targets: user?.targets || { daily: 8, weekly: 50, monthly: 200 },
      streak: user?.streak || 0,
      badges: user?.badges || [],
      consistencyScore: user?.consistencyScore || 0
    });
  } catch (error) {
    console.error('getMetrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/student/targets
export const updateTargets = async (req, res) => {
  try {
    const { daily, weekly, monthly } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { targets: { daily, weekly, monthly } },
      { new: true }
    ).select('-password');
    res.json({ targets: user.targets });
  } catch (error) {
    console.error('updateTargets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────
// STUDY REPORTS
// ──────────────────────────────────────────────

// POST /api/student/report
export const submitReport = async (req, res) => {
  try {
    const { date, subject, topic, studyHours, pyqsSolved, mockTestScore, accuracy, difficulties } = req.body;
    const userId = req.user._id;

    // Upsert: update or create report for this date
    const report = await StudyReport.findOneAndUpdate(
      { userId, date: new Date(date) },
      { userId, date: new Date(date), subject, topic, studyHours, pyqsSolved, mockTestScore, accuracy, difficulties },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update streak (Issue #2)
    await updateStreakLogic(userId);

    res.json({ message: 'Report submitted', report });
  } catch (error) {
    console.error('submitReport error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/student/reports/:userId
export const getReports = async (req, res) => {
  try {
    const reports = await StudyReport.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(100);
    res.json(reports);
  } catch (error) {
    console.error('getReports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────
// STREAKS (Issue #2)
// ──────────────────────────────────────────────

async function updateStreakLogic(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  if (lastActive) lastActive.setHours(0, 0, 0, 0);

  if (lastActive && lastActive.getTime() === today.getTime()) {
    // Already active today, no change
    return;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive && lastActive.getTime() === yesterday.getTime()) {
    // Consecutive day: increment streak
    user.streak += 1;
  } else {
    // Gap > 1 day: reset streak
    user.streak = 1;
  }

  user.lastActiveDate = today;

  // Check for badge milestones (Issue #10)
  const badgeMilestones = [
    { days: 7, name: 'Consistency Builder 🌱' },
    { days: 14, name: 'Dedicated Aspirant ⚡' },
    { days: 30, name: 'Discipline Master 👑' },
    { days: 60, name: 'Iron Will 🔥' },
    { days: 100, name: 'GATE Warrior 🏆' }
  ];

  for (const milestone of badgeMilestones) {
    if (user.streak >= milestone.days) {
      const alreadyHas = user.badges.some(b => b.name === milestone.name);
      if (!alreadyHas) {
        user.badges.push({ name: milestone.name, earnedDate: new Date() });
      }
    }
  }

  // Update consistency score
  const totalReports = await StudyReport.countDocuments({ userId });
  const daysSinceSignup = Math.max(1, Math.ceil((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)));
  user.consistencyScore = Math.min(100, Math.round((totalReports / daysSinceSignup) * 100));

  await user.save();
}

// POST /api/student/streak (manual trigger from frontend)
export const updateStreak = async (req, res) => {
  try {
    await updateStreakLogic(req.user._id);
    const user = await User.findById(req.user._id).select('streak badges lastActiveDate consistencyScore');
    res.json({
      streak: user.streak,
      badges: user.badges,
      lastActiveDate: user.lastActiveDate,
      consistencyScore: user.consistencyScore
    });
  } catch (error) {
    console.error('updateStreak error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────
// SYLLABUS PROGRESS (Issue #3)
// ──────────────────────────────────────────────

// GET /api/student/syllabus-progress/:userId
export const getSyllabusProgress = async (req, res) => {
  try {
    const progress = await SyllabusProgress.findOne({ userId: req.params.userId });
    res.json(progress || { progress: [] });
  } catch (error) {
    console.error('getSyllabusProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/student/syllabus-progress
export const updateSyllabusProgress = async (req, res) => {
  try {
    const { subjectIndex, topicIndex, subtopicIndex, completed, branch } = req.body;
    const userId = req.user._id;

    let progressDoc = await SyllabusProgress.findOne({ userId });

    if (!progressDoc) {
      progressDoc = new SyllabusProgress({ userId, branch, progress: [] });
    }

    // Find existing entry or create new
    const existingIdx = progressDoc.progress.findIndex(
      p => p.subjectIndex === subjectIndex && p.topicIndex === topicIndex && p.subtopicIndex === subtopicIndex
    );

    if (existingIdx >= 0) {
      progressDoc.progress[existingIdx].completed = completed;
      progressDoc.progress[existingIdx].completedDate = completed ? new Date() : null;
    } else if (completed) {
      progressDoc.progress.push({
        subjectIndex, topicIndex, subtopicIndex,
        completed: true,
        completedDate: new Date()
      });
    }

    progressDoc.lastUpdated = new Date();
    await progressDoc.save();

    res.json({ message: 'Progress updated', progress: progressDoc.progress });
  } catch (error) {
    console.error('updateSyllabusProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/student/syllabus-progress/bulk
export const bulkUpdateSyllabusProgress = async (req, res) => {
  try {
    const { updates, branch } = req.body; // updates: [{subjectIndex, topicIndex, subtopicIndex, completed}]
    const userId = req.user._id;

    let progressDoc = await SyllabusProgress.findOne({ userId });
    if (!progressDoc) {
      progressDoc = new SyllabusProgress({ userId, branch, progress: [] });
    }

    for (const update of updates) {
      const existingIdx = progressDoc.progress.findIndex(
        p => p.subjectIndex === update.subjectIndex &&
             p.topicIndex === update.topicIndex &&
             p.subtopicIndex === update.subtopicIndex
      );
      if (existingIdx >= 0) {
        progressDoc.progress[existingIdx].completed = update.completed;
        progressDoc.progress[existingIdx].completedDate = update.completed ? new Date() : null;
      } else if (update.completed) {
        progressDoc.progress.push({ ...update, completedDate: new Date() });
      }
    }

    progressDoc.lastUpdated = new Date();
    await progressDoc.save();

    res.json({ message: 'Bulk progress updated', progress: progressDoc.progress });
  } catch (error) {
    console.error('bulkUpdateSyllabusProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────
// DAILY TASKS (Issue #4)
// ──────────────────────────────────────────────

const DEFAULT_TASKS = [
  { id: 'revision', name: '📖 Complete daily revision' },
  { id: 'pyqs', name: '📝 Solve PYQs' },
  { id: 'mock', name: '📊 Attempt mock test' },
  { id: 'notes', name: '✍️ Write summary notes' },
  { id: 'report', name: '📋 Submit study report' },
];

// GET /api/student/daily-tasks/:date
export const getDailyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const dateStr = req.params.date; // YYYY-MM-DD

    let taskDoc = await DailyTask.findOne({ userId, date: dateStr });

    if (!taskDoc) {
      // Generate default tasks for today
      taskDoc = await DailyTask.create({
        userId,
        date: dateStr,
        tasks: DEFAULT_TASKS.map(t => ({ ...t, completed: false })),
        allCompleted: false
      });
    }

    res.json(taskDoc);
  } catch (error) {
    console.error('getDailyTasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/student/daily-tasks/:date
export const updateDailyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const dateStr = req.params.date;
    const { tasks } = req.body;

    const allCompleted = tasks.every(t => t.completed);

    const taskDoc = await DailyTask.findOneAndUpdate(
      { userId, date: dateStr },
      { tasks, allCompleted },
      { new: true, upsert: true }
    );

    // If all tasks completed, update streak
    if (allCompleted) {
      await updateStreakLogic(userId);
    }

    res.json(taskDoc);
  } catch (error) {
    console.error('updateDailyTasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

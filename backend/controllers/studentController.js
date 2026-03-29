import mongoose from 'mongoose';
import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
import SyllabusProgress from '../models/SyllabusProgress.js';
import DailyTask from '../models/DailyTask.js';
import Timetable from '../models/Timetable.js';
import { getGATESyllabus } from '../services/gateSyllabusData.js';

// ─── Helpers ───────────────────────────────────────────────
function startOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function startOfMonth(date) {
  const d = new Date(date);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function endOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

// ─── GET /api/student/targets/:userId ──────────────────────
export const getTargets = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('targets name');
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });
    res.json({ success: true, targets: user.targets });
  } catch (err) {
    console.error('getTargets error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// POST /api/student/targets/:userId
export const updateTargets = async (req, res) => {
  try {
    const { daily, weekly, monthly } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    if (daily !== undefined) user.targets.daily = Math.max(0, Number(daily));
    if (weekly !== undefined) user.targets.weekly = Math.max(0, Number(weekly));
    if (monthly !== undefined) user.targets.monthly = Math.max(0, Number(monthly));
    await user.save();

    res.json({ success: true, targets: user.targets });
  } catch (err) {
    console.error('updateTargets error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── GET /api/student/progress/:userId ─────────────────────
// Returns { today, week, month } study hours aggregated from StudyReport
export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    const oid = new mongoose.Types.ObjectId(userId);
    const [todayAgg, weekAgg, monthAgg] = await Promise.all([
      StudyReport.aggregate([
        { $match: { userId: oid, date: { $gte: startOfDay(now), $lte: endOfDay(now) } } },
        { $group: { _id: null, total: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, avgAccuracy: { $avg: '$accuracy' } } }
      ]),
      StudyReport.aggregate([
        { $match: { userId: oid, date: { $gte: startOfWeek(now), $lte: endOfDay(now) } } },
        { $group: { _id: null, total: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, avgAccuracy: { $avg: '$accuracy' } } }
      ]),
      StudyReport.aggregate([
        { $match: { userId: oid, date: { $gte: startOfMonth(now), $lte: endOfDay(now) } } },
        { $group: { _id: null, total: { $sum: '$studyHours' }, pyqs: { $sum: '$pyqsSolved' }, avgAccuracy: { $avg: '$accuracy' } } }
      ])
    ]);

    const user = await User.findById(userId).select('targets');

    res.json({
      success: true,
      progress: {
        today: {
          studyHours: todayAgg[0]?.total || 0,
          pyqsSolved: todayAgg[0]?.pyqs || 0,
          accuracy: Math.round(todayAgg[0]?.avgAccuracy || 0)
        },
        week: {
          studyHours: weekAgg[0]?.total || 0,
          pyqsSolved: weekAgg[0]?.pyqs || 0,
          accuracy: Math.round(weekAgg[0]?.avgAccuracy || 0)
        },
        month: {
          studyHours: monthAgg[0]?.total || 0,
          pyqsSolved: monthAgg[0]?.pyqs || 0,
          accuracy: Math.round(monthAgg[0]?.avgAccuracy || 0)
        },
        targets: user?.targets || { daily: 6, weekly: 42, monthly: 180 }
      }
    });
  } catch (err) {
    console.error('getProgress error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── POST /api/student/study-report ────────────────────────
export const createStudyReport = async (req, res) => {
  try {
    const { userId, date, subject, topic, studyHours, pyqsSolved, mockTestScore, accuracy, difficulties } = req.body;

    if (!userId || !date || !subject || !topic || studyHours === undefined || pyqsSolved === undefined) {
      return res.status(400).json({ error: true, message: 'Missing required fields (userId, date, subject, topic, studyHours, pyqsSolved).' });
    }

    const reportDate = startOfDay(new Date(date));

    // Check for duplicate
    const existing = await StudyReport.findOne({ userId, date: reportDate });
    if (existing) {
      return res.status(400).json({ error: true, message: 'A study report already exists for this date. Update it instead.' });
    }

    const report = await StudyReport.create({
      userId,
      date: reportDate,
      subject,
      topic,
      studyHours: Math.max(0, Number(studyHours)),
      pyqsSolved: Math.max(0, Number(pyqsSolved)),
      mockTestScore: Math.min(100, Math.max(0, Number(mockTestScore || 0))),
      accuracy: Math.min(100, Math.max(0, Number(accuracy || 0))),
      difficulties: difficulties || ''
    });

    // Update streak logic
    await updateStreakAfterReport(userId, reportDate);

    // Emit progress-updated to all connected clients (including mentors)
    const io = req.app.get('io');
    if (io) {
      io.emit('progress-updated', { userId, report });
    }

    res.status(201).json({ success: true, report });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: true, message: 'A study report already exists for this date.' });
    }
    console.error('createStudyReport error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── GET /api/student/study-reports/:userId ────────────────
export const getStudyReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;

    const filter = { userId };
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = startOfDay(new Date(start));
      if (end) filter.date.$lte = endOfDay(new Date(end));
    }

    const reports = await StudyReport.find(filter).sort({ date: -1 }).limit(100);
    res.json({ success: true, reports });
  } catch (err) {
    console.error('getStudyReports error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── Syllabus Progress ─────────────────────────────────────
export const getSyllabusProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('branch');
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    let progress = await SyllabusProgress.findOne({ userId });
    if (!progress) {
      // Initialize with all subtopics uncompleted
      const syllabusItems = [];
      const branchSyllabus = getGATESyllabus(user.branch);
      if (branchSyllabus && branchSyllabus.subjects) {
        branchSyllabus.subjects.forEach((subject, si) => {
          (subject.topics || []).forEach((topic, ti) => {
            (topic.subtopics || []).forEach((_, sti) => {
              syllabusItems.push({ subjectIndex: si, topicIndex: ti, subtopicIndex: sti, completed: false });
            });
          });
        });
      }

      progress = await SyllabusProgress.create({
        userId,
        branch: user.branch,
        progress: syllabusItems
      });
    }

    const totalSubtopics = progress.progress.length;
    const completedSubtopics = progress.progress.filter(p => p.completed).length;

    res.json({
      success: true,
      branch: progress.branch,
      totalSubtopics,
      completedSubtopics,
      percentage: totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0,
      progress: progress.progress,
      syllabusData: getGATESyllabus(progress.branch)
    });
  } catch (err) {
    console.error('getSyllabusProgress error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

export const updateSyllabusProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subjectIndex, topicIndex, subtopicIndex, completed } = req.body;

    if (subjectIndex === undefined || topicIndex === undefined || subtopicIndex === undefined) {
      return res.status(400).json({ error: true, message: 'subjectIndex, topicIndex, subtopicIndex are required.' });
    }

    let progress = await SyllabusProgress.findOne({ userId });
    if (!progress) {
      return res.status(404).json({ error: true, message: 'No syllabus progress found. Access GET first to initialize.' });
    }

    // Find the matching entry
    const entry = progress.progress.find(
      p => p.subjectIndex === subjectIndex && p.topicIndex === topicIndex && p.subtopicIndex === subtopicIndex
    );

    if (entry) {
      entry.completed = !!completed;
      entry.completedDate = completed ? new Date() : null;
    } else {
      progress.progress.push({
        subjectIndex, topicIndex, subtopicIndex,
        completed: !!completed,
        completedDate: completed ? new Date() : null
      });
    }

    progress.lastUpdated = new Date();
    await progress.save();

    const totalSubtopics = progress.progress.length;
    const completedSubtopics = progress.progress.filter(p => p.completed).length;

    // Emit syllabus-updated
    const io = req.app.get('io');
    if (io) {
      io.emit('syllabus-updated', { userId, totalSubtopics, completedSubtopics });
    }

    res.json({
      success: true,
      totalSubtopics,
      completedSubtopics,
      percentage: totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0
    });
  } catch (err) {
    console.error('updateSyllabusProgress error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── Daily Tasks ───────────────────────────────────────────
export const getDailyTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const dateStr = req.query.date || new Date().toISOString();
    const taskDate = startOfDay(new Date(dateStr));

    let dailyTask = await DailyTask.findOne({ userId, date: taskDate });
    if (!dailyTask) {
      // Auto-create default tasks
      dailyTask = await DailyTask.create({
        userId,
        date: taskDate,
        tasks: DailyTask.DEFAULT_TASKS.map(name => ({ name, completed: false }))
      });
    }

    const allCompleted = dailyTask.tasks.every(t => t.completed);

    res.json({
      success: true,
      date: taskDate,
      tasks: dailyTask.tasks,
      allCompleted,
      completedCount: dailyTask.tasks.filter(t => t.completed).length,
      totalCount: dailyTask.tasks.length
    });
  } catch (err) {
    console.error('getDailyTasks error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

export const updateDailyTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, tasks } = req.body;
    const taskDate = startOfDay(new Date(date || new Date()));

    let dailyTask = await DailyTask.findOne({ userId, date: taskDate });
    if (!dailyTask) {
      dailyTask = await DailyTask.create({
        userId,
        date: taskDate,
        tasks: DailyTask.DEFAULT_TASKS.map(name => ({ name, completed: false }))
      });
    }

    // Update task completion status
    if (Array.isArray(tasks)) {
      tasks.forEach(update => {
        const task = dailyTask.tasks.find(t => t.name === update.name || t._id.toString() === update._id);
        if (task) task.completed = !!update.completed;
      });
    }

    await dailyTask.save();

    // Check if this triggers streak
    const allCompleted = dailyTask.tasks.every(t => t.completed);
    if (allCompleted) {
      await updateStreakAfterReport(userId, taskDate);
    }

    res.json({
      success: true,
      tasks: dailyTask.tasks,
      allCompleted,
      completedCount: dailyTask.tasks.filter(t => t.completed).length
    });
  } catch (err) {
    console.error('updateDailyTasks error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// ─── Streak Logic ──────────────────────────────────────────
async function updateStreakAfterReport(userId, date) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = startOfDay(date);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    // Check if report exists AND all daily tasks are completed
    const [report, dailyTask] = await Promise.all([
      StudyReport.findOne({ userId, date: today }),
      DailyTask.findOne({ userId, date: today })
    ]);

    const hasReport = !!report;
    const allTasksDone = dailyTask ? dailyTask.tasks.every(t => t.completed) : false;

    if (hasReport && allTasksDone) {
      if (user.lastActiveDate) {
        const lastActive = startOfDay(user.lastActiveDate);
        const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays === 0) {
          // Same day, no change
        } else {
          user.streak = 1; // Reset, start fresh
        }
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = today;

      // Award badges
      const streakMilestones = [
        { threshold: 7, name: '🔥 7-Day Warrior' },
        { threshold: 14, name: '⚡ 14-Day Champion' },
        { threshold: 30, name: '🏆 30-Day Legend' },
        { threshold: 60, name: '💎 60-Day Diamond' },
        { threshold: 100, name: '👑 100-Day Master' }
      ];

      for (const milestone of streakMilestones) {
        if (user.streak >= milestone.threshold) {
          const alreadyHas = user.badges.some(b => b.name === milestone.name);
          if (!alreadyHas) {
            user.badges.push({ name: milestone.name, earnedDate: new Date() });
          }
        }
      }

      await user.save();
    }
  } catch (err) {
    console.error('updateStreakAfterReport error:', err);
  }
}

// GET /api/student/streak/:userId
export const getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('streak badges lastActiveDate');
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    res.json({
      success: true,
      streak: user.streak,
      badges: user.badges,
      lastActiveDate: user.lastActiveDate
    });
  } catch (err) {
    console.error('getStreak error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// GET /api/student/rewards/:userId
export const getRewards = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('streak badges consistencyScore');
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    const milestones = [7, 14, 30, 60, 100];
    const nextMilestone = milestones.find(m => m > user.streak) || null;
    const daysToNext = nextMilestone ? nextMilestone - user.streak : 0;

    res.json({
      success: true,
      streak: user.streak,
      badges: user.badges,
      consistencyScore: user.consistencyScore,
      nextMilestone,
      daysToNextMilestone: daysToNext
    });
  } catch (err) {
    console.error('getRewards error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// GET /api/student/timetable/:userId
export const getTimetable = async (req, res) => {
  try {
    // Fetch the latest timetable from the Timetable collection
    const timetable = await Timetable.findOne({ studentId: req.params.userId })
      .sort({ weekStart: -1 });

    if (!timetable) {
      return res.json({ success: true, timetable: null });
    }

    res.json({ success: true, timetable });
  } catch (err) {
    console.error('getTimetable error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// POST /api/student/timetable-complete/:userId
export const markTimetableComplete = async (req, res) => {
  try {
    const { timetableId, day, completed } = req.body;
    const timetable = await Timetable.findById(timetableId);

    if (!timetable) {
      return res.status(404).json({ error: true, message: 'Timetable not found.' });
    }

    const dayEntry = timetable.days.find(d => d.day === day);
    if (!dayEntry) {
      return res.status(400).json({ error: true, message: `Day '${day}' not found in timetable.` });
    }

    dayEntry.studentCompleted = completed;
    dayEntry.studentCompletedAt = completed ? new Date() : null;
    await timetable.save();

    res.json({ success: true, timetable });
  } catch (err) {
    console.error('markTimetableComplete error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// GET /api/student/journey/:userId
export const getJourney = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('journeySteps');
    if (!user) return res.status(404).json({ error: true, message: 'Student not found.' });

    const completedCount = user.journeySteps.filter(s => s.completed).length;

    res.json({
      success: true,
      journeySteps: user.journeySteps,
      completedCount,
      totalSteps: user.journeySteps.length,
      percentage: user.journeySteps.length > 0 ? Math.round((completedCount / user.journeySteps.length) * 100) : 0
    });
  } catch (err) {
    console.error('getJourney error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

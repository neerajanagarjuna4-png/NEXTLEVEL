import FocusSession from '../models/FocusSession.js';
import StudyReport from '../models/StudyReport.js';

const toDateOnly = (d) => { const dt = new Date(d); dt.setHours(0,0,0,0); return dt; };

// POST /api/focus/log
export const logSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject = 'General', topic = 'General', minutes, notes = '' } = req.body;
    if (!minutes || minutes <= 0) return res.status(400).json({ error: true, message: 'minutes required and must be > 0' });

    const date = toDateOnly(new Date());

    const session = await FocusSession.create({ userId, date, subject, topic, minutes, notes });

    // Update or create today's StudyReport (one report per user per day)
    const hoursToAdd = Math.round((minutes / 60) * 100) / 100;
    let report = await StudyReport.findOne({ userId, date });
    if (!report) {
      report = await StudyReport.create({ userId, date, subject, topic, studyHours: hoursToAdd, pyqsSolved: 0 });
    } else {
      report.studyHours = Math.round(((report.studyHours || 0) + hoursToAdd) * 100) / 100;
      // Keep other fields unchanged
      await report.save();
    }

    res.json({ success: true, session, report });
  } catch (err) {
    console.error('logSession error:', err);
    res.status(500).json({ error: true, message: 'Server error logging session.' });
  }
};

// GET /api/focus/today
export const getTodaySessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = toDateOnly(new Date());
    const sessions = await FocusSession.find({ userId, date }).sort({ createdAt: -1 }).limit(200);
    const totalMinutes = (sessions || []).reduce((s, i) => s + (i.minutes || 0), 0);
    res.json({ success: true, sessions, totalMinutes, totalHours: Math.round((totalMinutes/60) * 100)/100 });
  } catch (err) {
    console.error('getTodaySessions error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

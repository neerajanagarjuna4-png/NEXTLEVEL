import MentorFeedback from '../models/MentorFeedback.js';
import Notification from '../models/Notification.js';

// POST /api/feedback (mentor adds feedback)
export const addFeedback = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { studentId, type = 'weekly', text, ratings = {}, topic, isPublic = true } = req.body;
    if (!studentId || !text) return res.status(400).json({ error: true, message: 'studentId and text required' });
    const fb = await MentorFeedback.create({ studentId, mentorId, type, text, ratings, topic, isPublic });

    // Create notification for student
    try {
      const note = await Notification.create({ userId: studentId, type: 'mentor_feedback', title: 'New mentor feedback', message: text.slice(0, 200), link: '/feedback' });
      const io = req.app.get('io');
      if (io) io.to(`student_${studentId}`).emit('mentor_feedback', { feedbackId: fb._id, notificationId: note._id });
    } catch (e) { console.error('feedback notify error', e); }

    res.json({ success: true, feedback: fb });
  } catch (err) {
    console.error('addFeedback error:', err);
    res.status(500).json({ error: true, message: 'Server error adding feedback.' });
  }
};

// GET /api/feedback/:studentId
export const getFeedbackForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ error: true, message: 'studentId required' });
    const fbs = await MentorFeedback.find({ studentId }).sort({ createdAt: -1 }).populate('mentorId', 'name email');
    res.json({ success: true, feedback: fbs });
  } catch (err) {
    console.error('getFeedbackForStudent error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

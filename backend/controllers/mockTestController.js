import MockTestAttempt from '../models/MockTestAttempt.js';
import StudyReport from '../models/StudyReport.js';

// POST /api/mock-test/start
export const startTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testType, subject, questions = [] } = req.body;
    const attempt = await MockTestAttempt.create({ userId, testType, subject, questions, startedAt: new Date() });
    res.json({ success: true, attemptId: attempt._id });
  } catch (err) {
    console.error('startTest error:', err);
    res.status(500).json({ error: true, message: 'Server error starting test.' });
  }
};

// POST /api/mock-test/submit
export const submitTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { attemptId, answers = [] } = req.body;
    const attempt = await MockTestAttempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: true, message: 'Attempt not found' });

    // Merge answers into attempt.questions; answers: [{questionId, selectedAnswer, isCorrect, timeTaken}]
    let correct = 0;
    let total = 0;
    const map = {};
    for (const a of answers) map[a.questionId] = a;
    for (const q of attempt.questions) {
      total += 1;
      const ans = map[q.questionId];
      if (ans) {
        q.selectedAnswer = ans.selectedAnswer;
        q.isCorrect = !!ans.isCorrect;
        q.timeTaken = ans.timeTaken || 0;
        if (q.isCorrect) correct += 1;
      }
    }

    attempt.submittedAt = new Date();
    attempt.score = correct; // assume 1 mark per question
    attempt.totalMarks = total;
    attempt.accuracy = total ? Math.round((correct / total) * 100) : 0;
    await attempt.save();

    // Optionally save a StudyReport entry for the mock (lightweight)
    try {
      await StudyReport.create({ userId, date: new Date(), subject: attempt.subject || 'Mock', studyHours: 0, pyqsSolved: 0, mockTestScore: attempt.score, accuracy: attempt.accuracy });
    } catch (e) {}

    res.json({ success: true, attempt });
  } catch (err) {
    console.error('submitTest error:', err);
    res.status(500).json({ error: true, message: 'Server error submitting test.' });
  }
};

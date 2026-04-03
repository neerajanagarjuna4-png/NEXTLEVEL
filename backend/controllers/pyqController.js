import PYQProgress from '../models/PYQProgress.js';

// POST /api/pyq/attempt
export const recordAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, subject, status, timeTaken = 0 } = req.body;
    if (!questionId || !status) return res.status(400).json({ error: true, message: 'questionId and status required' });
    let prog = await PYQProgress.findOne({ userId });
    if (!prog) prog = await PYQProgress.create({ userId, attempts: [] });
    prog.attempts.push({ questionId, subject, status, timeTaken, attemptedAt: new Date() });
    // also add to bookmarks if bookmarked
    if (status === 'bookmarked') {
      if (!prog.bookmarks.includes(questionId)) prog.bookmarks.push(questionId);
    }
    await prog.save();
    res.json({ success: true, attempt: prog.attempts[prog.attempts.length - 1] });
  } catch (err) {
    console.error('recordAttempt error:', err);
    res.status(500).json({ error: true, message: 'Server error recording attempt.' });
  }
};

// GET /api/pyq/progress
export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const prog = await PYQProgress.findOne({ userId });
    if (!prog) return res.json({ success: true, attempts: [], bookmarks: [] });
    // compute per-subject accuracy
    const grouping = {};
    for (const a of prog.attempts || []) {
      const subj = a.subject || 'General';
      grouping[subj] = grouping[subj] || { correct: 0, total: 0 };
      if (a.status === 'correct') grouping[subj].correct += 1;
      if (['correct','wrong'].includes(a.status)) grouping[subj].total += 1;
    }
    const analysis = Object.keys(grouping).map(k => ({ subject: k, accuracy: grouping[k].total ? Math.round((grouping[k].correct / grouping[k].total) * 100) : null, attempted: grouping[k].total }));
    res.json({ success: true, attempts: prog.attempts, bookmarks: prog.bookmarks, analysis });
  } catch (err) {
    console.error('getProgress error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// POST /api/pyq/bookmark { questionId }
export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId } = req.body;
    if (!questionId) return res.status(400).json({ error: true, message: 'questionId required' });
    let prog = await PYQProgress.findOne({ userId });
    if (!prog) prog = await PYQProgress.create({ userId, bookmarks: [] });
    const idx = (prog.bookmarks || []).indexOf(questionId);
    if (idx === -1) {
      prog.bookmarks.push(questionId);
      await prog.save();
      return res.json({ success: true, bookmarked: true });
    }
    prog.bookmarks.splice(idx, 1);
    await prog.save();
    return res.json({ success: true, bookmarked: false });
  } catch (err) {
    console.error('toggleBookmark error:', err);
    res.status(500).json({ error: true, message: 'Server error toggling bookmark.' });
  }
};

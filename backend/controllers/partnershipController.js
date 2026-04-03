import Partnership from '../models/Partnership.js';
import Notification from '../models/Notification.js';

// POST /api/partnerships/request
export const requestPartnership = async (req, res) => {
  try {
    const from = req.user._id;
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ error: true, message: 'toUserId required' });
    // Check existing
    const exists = await Partnership.findOne({ $or: [ { studentA: from, studentB: toUserId }, { studentA: toUserId, studentB: from } ] });
    if (exists) return res.status(400).json({ error: true, message: 'Partnership already exists or pending' });
    const p = await Partnership.create({ studentA: from, studentB: toUserId, status: 'pending' });
    // notify partner
    const note = await Notification.create({ userId: toUserId, type: 'partnership_request', title: 'New partnership request', message: 'You have a new accountability partner request.' });
    const io = req.app.get('io'); if (io) io.to(`student_${toUserId}`).emit('partnership_request', { partnershipId: p._id });
    res.json({ success: true, partnership: p });
  } catch (err) {
    console.error('requestPartnership error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// POST /api/partnerships/respond
export const respondPartnership = async (req, res) => {
  try {
    const userId = req.user._id;
    const { partnershipId, accept } = req.body;
    const p = await Partnership.findById(partnershipId);
    if (!p) return res.status(404).json({ error: true, message: 'Partnership not found' });
    if (![p.studentA.toString(), p.studentB.toString()].includes(userId.toString())) return res.status(403).json({ error: true, message: 'Not a participant' });
    if (accept) {
      p.status = 'active';
      p.acceptedAt = new Date();
      await p.save();
      const other = p.studentA.toString() === userId.toString() ? p.studentB : p.studentA;
      await Notification.create({ userId: other, type: 'partnership_accepted', title: 'Partnership accepted', message: 'Your partnership request was accepted.' });
      const io = req.app.get('io'); if (io) io.to(`student_${other}`).emit('partnership_accepted', { partnershipId: p._id });
    } else {
      p.status = 'ended';
      await p.save();
    }
    res.json({ success: true, partnership: p });
  } catch (err) {
    console.error('respondPartnership error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// POST /api/partnerships/checkin
export const sendCheckIn = async (req, res) => {
  try {
    const from = req.user._id;
    const { partnershipId, message } = req.body;
    const p = await Partnership.findById(partnershipId);
    if (!p) return res.status(404).json({ error: true, message: 'Partnership not found' });
    const partner = p.studentA.toString() === from.toString() ? p.studentB : p.studentA;
    p.checkIns.push({ fromUserId: from, message, sentAt: new Date() });
    await p.save();
    await Notification.create({ userId: partner, type: 'checkin', title: 'Accountability check-in', message: message.slice(0,120) });
    const io = req.app.get('io'); if (io) io.to(`student_${partner}`).emit('partnership_checkin', { partnershipId: p._id, message });
    res.json({ success: true, partnership: p });
  } catch (err) {
    console.error('sendCheckIn error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

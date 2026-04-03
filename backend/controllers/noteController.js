import Note from '../models/Note.js';

// GET /api/notes?subject=&topic=
export const listNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject, topic } = req.query;
    const q = { userId };
    if (subject) q.subject = subject;
    if (topic) q.topic = topic;
    const notes = await Note.find(q).sort({ updatedAt: -1 }).limit(200);
    res.json({ success: true, notes });
  } catch (err) {
    console.error('listNotes error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// POST /api/notes (create or update)
export const saveNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, subject, topic, content } = req.body;
    const wordCount = content ? content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length : 0;
    if (id) {
      const note = await Note.findOne({ _id: id, userId });
      if (!note) return res.status(404).json({ error: true, message: 'Note not found' });
      note.subject = subject ?? note.subject;
      note.topic = topic ?? note.topic;
      note.content = content ?? note.content;
      note.wordCount = wordCount;
      await note.save();
      return res.json({ success: true, note });
    }
    const created = await Note.create({ userId, subject, topic, content, wordCount });
    res.json({ success: true, note: created });
  } catch (err) {
    console.error('saveNote error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

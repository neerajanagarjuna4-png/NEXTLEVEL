import React, { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ShareStoryModal({ onSubmitted }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const submit = async () => {
    if (!title || !content) return toast.error('Title and content are required');
    try {
      await api.post('/stories', { title, content, mediaUrl });
      toast.success('Story submitted for review ✓');
      setOpen(false);
      setTitle(''); setContent(''); setMediaUrl('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      toast.error('Could not submit story');
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>✏️ Share Your Story</button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Share Your Story</h3>
            <label>Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
            <label>Content</label>
            <textarea className="input" rows={6} value={content} onChange={e => setContent(e.target.value)} maxLength={5000} />
            <label>Media URL (optional)</label>
            <input className="input" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={submit}>Submit</button>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

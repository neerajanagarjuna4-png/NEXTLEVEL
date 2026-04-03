import React, { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function CommentSection({ story, onNewComment }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await api.post(`/stories/${story._id}/comment`, { text });
      onNewComment && onNewComment(res.data.comment);
      setText('');
    } catch (err) {
      toast.error('Failed to post comment');
    } finally { setLoading(false); }
  };

  const del = async (commentId) => {
    try {
      await api.delete(`/stories/${story._id}/comment/${commentId}`);
      // remove from UI by reloading full story in parent (handled by parent callback)
      toast.success('Comment deleted');
    } catch (err) { toast.error('Could not delete'); }
  };

  const { user } = useAuth();

  return (
    <div>
      <div className="comments-list">
        {(story.comments || []).map(c => (
          <div key={c._id} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><strong>{c.userId?.name || 'User'}</strong> <span className="text-sm text-muted">{new Date(c.createdAt).toLocaleString()}</span></div>
              {/* deletion handled by API; only owner can delete */}
              {user && c.userId && c.userId._id === user._id && <button className="btn btn-sm btn-ghost" onClick={() => del(c._id)}>Delete</button>}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..." />
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
      </div>
    </div>
  );
}

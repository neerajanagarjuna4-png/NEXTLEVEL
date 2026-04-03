import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import CommentSection from './CommentSection.jsx';
import toast from 'react-hot-toast';

export default function StoryDetailModal({ storyId, onClose }) {
  const [story, setStory] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/stories/${storyId}`);
        setStory(res.data.story);
      } catch (err) {
        toast.error('Failed to load story');
        onClose();
      }
    };
    load();
  }, [storyId]);

  if (!story) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{story.title}</h3>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="story-meta text-sm text-muted">By {story.userId?.name || 'Anonymous'} • {new Date(story.createdAt).toLocaleString()}</div>
        <div style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{story.content}</div>
        {story.mediaUrl && (
          <div style={{ marginTop: 12 }}>
            {story.mediaUrl.includes('youtube') ? (
              <iframe width="100%" height="320" src={story.mediaUrl} title="media" />
            ) : (
              <img src={story.mediaUrl} alt="media" style={{ maxWidth: '100%' }} />
            )}
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <CommentSection story={story} onNewComment={(c) => setStory(prev => ({ ...prev, comments: [...(prev.comments||[]), c] }))} />
        </div>
      </div>
    </div>
  );
}

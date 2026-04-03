import React, { useState } from 'react';
import api from '../../utils/api';
import StoryDetailModal from './StoryDetailModal.jsx';
import toast from 'react-hot-toast';

export default function StoryCard({ story, onUpdate }) {
  const [liked, setLiked] = useState(() => (story.likes || []).length > 0);
  const [likesCount, setLikesCount] = useState((story.likes || []).length || 0);
  const [open, setOpen] = useState(false);

  const toggleLike = async () => {
    try {
      const res = await api.put(`/stories/${story._id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes);
    } catch (err) {
      toast.error('Could not update like');
    }
  };

  return (
    <div className="card card-hover story-card" onClick={() => setOpen(true)}>
      <div className="story-header">
        <div>
          <strong>{story.title}</strong>
          <div className="text-sm text-muted">by {story.userId?.name || 'Anonymous'} • {new Date(story.createdAt).toLocaleDateString()}</div>
        </div>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); toggleLike(); }}>{liked ? '❤' : '♡'} {likesCount}</button>
        </div>
      </div>
      <p className="text-sm">{story.content?.slice(0, 200)}{story.content && story.content.length > 200 ? '…' : ''}</p>
      {open && <StoryDetailModal storyId={story._id} onClose={() => { setOpen(false); if (onUpdate) onUpdate(); }} />}
    </div>
  );
}

import React from 'react';

const COLORS = {
  video: '#60a5fa',
  practice: '#34d399',
  revision: '#f59e0b',
  other: '#9CA3AF'
};

export default function ActivityBadge({ type, children }) {
  const key = (type || '').toLowerCase();
  const bg = COLORS[key] || COLORS.other;
  return (
    <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: 9999, background: bg, color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>{children || type}</span>
  );
}

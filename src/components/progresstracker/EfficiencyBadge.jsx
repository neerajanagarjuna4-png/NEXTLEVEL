import React from 'react';

export default function EfficiencyBadge({ percent }) {
  const p = Number(percent) || 0;
  let bg = '#ef4444';
  let label = 'Low';
  if (p >= 90) { bg = '#10b981'; label = 'Excellent'; }
  else if (p >= 60) { bg = '#f59e0b'; label = 'Good'; }
  else if (p >= 40) { bg = '#f97316'; label = 'Fair'; }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 9999, background: bg, color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>{label} ({Math.round(p)}%)</span>
  );
}

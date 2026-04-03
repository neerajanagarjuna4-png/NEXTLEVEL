import React from 'react';

export default function EfficiencyBadge({ efficiency }) {
  let color = 'red';
  if (efficiency >= 75) color = 'green';
  else if (efficiency >= 50) color = 'yellow';
  return (
    <span className={`efficiency-badge ${color}`}>{efficiency}%</span>
  );
}

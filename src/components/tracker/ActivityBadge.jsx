import React from 'react';

const COLORS = {
  Video: 'blue',
  Practice: 'pink',
  Revision: 'purple',
  Break: 'gray',
  Apti: 'orange',
  Other: 'teal'
};

export default function ActivityBadge({ activity }) {
  return (
    <span className={`activity-badge ${COLORS[activity] || 'default'}`}>{activity}</span>
  );
}

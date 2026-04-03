import React from 'react';
import StoriesFeed from '../components/stories/StoriesFeed.jsx';

export default function StoriesPage() {
  return (
    <div className="page page-enter">
      <h1>Community Stories</h1>
      <StoriesFeed />
    </div>
  );
}

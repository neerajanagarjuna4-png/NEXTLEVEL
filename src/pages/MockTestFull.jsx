import React from 'react';

export default function MockTestFull() {
  return (
    <div style={{ height: '100vh', width: '100vw', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Mock Test (Full-screen)</h1>
        <p>This view is optimized for taking a timed mock test.</p>
        <div className="card" style={{ padding: 20 }}>
          <p>Question area and timer appear here.</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

const phases = [
  { id: 'phase1', title: 'Phase 1: Syllabus', end: new Date('2026-11-30T23:59:59Z') },
  { id: 'phase2', title: 'Phase 2: Revision', end: new Date('2027-01-15T23:59:59Z') },
  { id: 'phase3', title: 'Phase 3: Mocks', end: new Date('2027-02-14T23:59:59Z') },
  { id: 'gate', title: 'GATE 2027', end: new Date('2027-02-15T09:00:00Z') }
];

export default function MasterTimeline() {
  const now = new Date();
  const activeIndex = phases.findIndex(p => now <= p.end);
  const current = activeIndex === -1 ? phases.length - 1 : activeIndex;

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 6px' }}>
      {phases.map((p, i) => {
        const past = i < current;
        const active = i === current;
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 120, textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: past ? '#E6E7F8' : active ? 'linear-gradient(90deg,#6C63FF,#FF6B35)' : '#f3f4f6', color: past ? '#94a3b8' : active ? '#fff' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {past ? '✓' : i+1}
              </div>
              <div style={{ fontSize: 12, marginTop: 6 }}>{p.title}</div>
            </div>
            {i < phases.length - 1 && <div style={{ width: 36, height: 2, background: i < current ? '#6C63FF' : '#E5E7EB' }} />}
          </div>
        );
      })}
    </div>
  );
}

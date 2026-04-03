import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: "The Beginner's Leap", desc: 'signup + first login', perk: 'Dashboard access' },
  { id: 2, title: 'The First Spark', desc: 'first study report submitted', perk: 'Focus Timer unlocked' },
  { id: 3, title: 'The Momentum Builder', desc: '3-day consecutive task completion', perk: 'White noise unlocked' },
  { id: 4, title: 'The Weakness Hunter', desc: 'weakest subject found (PYQ <50%)', perk: 'Weak area heatmap unlocked' },
  { id: 5, title: 'The Mock Warrior', desc: 'first full mock test taken', perk: 'Compare with Topper unlocked' },
  { id: 6, title: 'The Comeback Kid', desc: 'mock score improved 20%', perk: "Mentor feedback priority" },
  { id: 7, title: 'The Syllabus Conqueror', desc: '80% syllabus complete', perk: "Mentor's Secret Tip unlocked" },
  { id: 8, title: 'The GATE Gladiator', desc: 'streak >=30 + accuracy >=70%', perk: 'Final personal message from mentor' }
];

export default function MyJourney() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('journey:completed') || '[]'); } catch (e) { return []; }
  });

  useEffect(() => { localStorage.setItem('journey:completed', JSON.stringify(completed)); }, [completed]);

  const mark = (step) => {
    if (completed.includes(step)) return;
    setCompleted(prev => [...prev, step]);
    // Ceremonies
    if (step === 1) {
      confetti();
      toast.success('Welcome to NEXT_LEVEL');
    } else if (step === 2) {
      toast('You lit the fire!');
    } else if (step === 3) {
      // fire animation: small confetti burst
      confetti({ particleCount: 60, spread: 70, scalar: 0.9 });
      toast.success('Momentum unlocked!');
    } else if (step === 4) {
      alert('You found your enemy. Now we fight it together.');
    } else if (step === 5) {
      confetti({ particleCount: 150, spread: 120 });
      toast.success('Trophy earned!');
    } else if (step === 6) {
      toast('You are improving!');
    } else if (step === 7) {
      confetti({ particleCount: 300, spread: 160, colors: ['#FFD700','#FFAA00'] });
      toast.success('Crown unlocked!');
    } else if (step === 8) {
      confetti({ particleCount: 500, spread: 200 });
      toast.success('GATE Gladiator unlocked!');
    }
  };

  return (
    <div>
      <h2>My Journey</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {STEPS.map(s => (
          <div key={s.id} className={`card`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{s.title}</h4>
              <p style={{ margin: '6px 0 0 0', color: 'var(--color-text-muted)' }}>{s.desc}</p>
              <div style={{ marginTop: 6, fontWeight: 700 }}>Perk: {s.perk}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {completed.includes(s.id) ? (
                <div style={{ color: '#10b981', fontWeight: 800 }}>Unlocked ✓</div>
              ) : (
                <button className="btn btn-primary" onClick={() => mark(s.id)}>Focus here →</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

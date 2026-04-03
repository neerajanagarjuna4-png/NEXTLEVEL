import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function Focus() {
  const audioCtxRef = useRef(null);
  const bufferRef = useRef(null);
  const sourceRef = useRef(null);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    return () => { stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createWhiteNoise() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 2; // 2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    audioCtxRef.current = ctx;
    bufferRef.current = buffer;
  }

  function play() {
    if (!audioCtxRef.current) createWhiteNoise();
    const ctx = audioCtxRef.current;
    const src = ctx.createBufferSource();
    src.buffer = bufferRef.current;
    const gain = ctx.createGain(); gain.gain.value = volume;
    src.loop = true; src.connect(gain); gain.connect(ctx.destination); src.start();
    sourceRef.current = { src, gain };
    startRef.current = Date.now();
    setSeconds(0);
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    setPlaying(true);
  }

  function stop() {
    try { if (sourceRef.current) { sourceRef.current.src.stop(); sourceRef.current = null; } } catch (e) {}
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    // compute minutes logged
    const mins = Math.max(0, Math.round(seconds / 60));
    try { toast.success(`Focus session complete! ${mins} min logged ⏱️`); } catch (e) {}
    setPlaying(false);
    setSeconds(0);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Focus Timer</h2>
      <div className="card" style={{ padding: 16 }}>
        <p>White noise generator (built-in) — use to focus during study sessions.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn ${playing ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => playing ? stop() : play()}
            aria-pressed={playing}
            style={{ minWidth: 44, minHeight: 44 }}
          >
            {playing ? 'Stop' : 'Play'}
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                try { if (sourceRef.current) sourceRef.current.gain.gain.value = Number(e.target.value); } catch (e) {}
              }}
            />
          </label>

          <div style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
            {playing ? `Recording: ${Math.floor(seconds/60)}m ${seconds%60}s` : 'Not recording'}
          </div>
        </div>
      </div>
    </div>
  );
}

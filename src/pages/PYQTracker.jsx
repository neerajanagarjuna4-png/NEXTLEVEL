import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PYQTracker = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [questionId, setQuestionId] = useState('');
  const [subject, setSubject] = useState('General');
  const [status, setStatus] = useState('correct');

  useEffect(() => {
    if (user) loadProgress();
    // eslint-disable-next-line
  }, [user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/pyq/progress');
      if (res.data?.success) {
        setAnalysis(res.data.analysis || []);
        setAttempts(res.data.attempts || []);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const record = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/api/pyq/attempt', { questionId, subject, status });
      setQuestionId('');
      await loadProgress();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pyq-tracker-page">
      <h2>PYQ Tracker</h2>
      {loading && <p>Loading…</p>}

      <section style={{ marginBottom: 12 }}>
        <h3>Per-Subject Analysis</h3>
        {analysis.length === 0 && <p>No attempts yet.</p>}
        {analysis.length > 0 && (
          <ul>
            {analysis.map((a, i) => (
              <li key={i}>{a.subject}: {a.accuracy !== null ? `${a.accuracy}% accuracy` : 'N/A'} ({a.attempted} attempted)</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Record Attempt</h3>
        <form onSubmit={record} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Question ID" value={questionId} onChange={(e) => setQuestionId(e.target.value)} required />
          <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="correct">Correct</option>
            <option value="wrong">Wrong</option>
            <option value="bookmarked">Bookmarked</option>
          </select>
          <button type="submit" disabled={loading}>Record</button>
        </form>
      </section>

      <section>
        <h3>Recent Attempts</h3>
        {attempts.length === 0 && <p>No recent attempts.</p>}
        {attempts.length > 0 && (
          <ul>
            {attempts.slice().reverse().slice(0, 20).map((a, i) => (
              <li key={i}>{new Date(a.attemptedAt).toLocaleString()} — {a.subject} — {a.status}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PYQTracker;

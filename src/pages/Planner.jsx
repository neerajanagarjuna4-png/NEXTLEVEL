import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Planner = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [dailyHours, setDailyHours] = useState(4);

  useEffect(() => {
    if (user) fetchPlan();
    // eslint-disable-next-line
  }, [user]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/planner');
      if (res.data?.success) setPlan(res.data.plan);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/planner/generate', { targetDate, dailyHours });
      if (res.data?.success) setPlan(res.data.plan);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const markDay = async (date) => {
    try {
      setLoading(true);
      await api.patch('/api/planner/mark-day', { date, actualHours: 1 });
      await fetchPlan();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-page">
      <h2>Study Planner</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Target date:{' '}
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </label>
        <label>
          Daily hours:{' '}
          <input type="number" min={1} value={dailyHours} onChange={(e) => setDailyHours(Number(e.target.value))} style={{ width: 80 }} />
        </label>
        <button onClick={handleGenerate} disabled={loading}>Generate Plan</button>
      </div>

      {loading && <p>Loading…</p>}

      {!plan && !loading && (
        <div>
          <p>No plan found. Click "Generate Plan" to create a study plan from your remaining syllabus.</p>
        </div>
      )}

      {plan && (
        <div>
          <h3>Plan{plan.targetDate ? ` — target ${new Date(plan.targetDate).toDateString()}` : ''}</h3>
          <p>Generated: {plan.generatedAt ? new Date(plan.generatedAt).toLocaleString() : '—'}</p>
          <ul>
            {Array.isArray(plan.dailyPlans) && plan.dailyPlans.map((dp, idx) => (
              <li key={idx} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{new Date(dp.date).toDateString()}</strong>
                    {' — '}{dp.topics?.length || 0} topics
                    {dp.completed ? ' ✅' : ''}
                  </div>
                  {!dp.completed && (
                    <button onClick={() => markDay(dp.date)} disabled={loading}>Mark Done</button>
                  )}
                </div>
                <ul style={{ marginTop: 6 }}>
                  {Array.isArray(dp.topics) && dp.topics.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Planner;

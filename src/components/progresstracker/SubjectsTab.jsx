import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

function SmallGroupedBars({ values = [0,0,0,0] }) {
  const colors = ['#60a5fa','#34d399','#f59e0b','#9CA3AF'];
  const total = values.reduce((s,v)=>s+v,0) || 1;
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 48 }}>
      {values.map((v,i) => (
        <div key={i} style={{ width: 18, height: `${Math.round((v/total)*100)}%`, background: colors[i], borderRadius: 4 }} title={`${v}`} />
      ))}
    </div>
  );
}

export default function SubjectsTab() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/tracker/subjects');
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error('Subjects load', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const update = async (subject, patch) => {
    try {
      const res = await api.put('/api/tracker/subjects', { subject, ...patch });
      // update local
      setSubjects(prev => prev.map(s => s.subject === subject ? res.data : s));
    } catch (err) { console.error('Subjects update', err); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Subjects — Progress</h2>
        <div>
          <button className="btn" onClick={load}>Refresh</button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {subjects.map((s) => (
          <div key={s.subject} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: 6 }}>{s.subject}</h4>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ color: 'var(--color-text-muted)' }}>Video:</div><div style={{ fontWeight: 800 }}>{s.videoDone || 0}</div>
                <div style={{ color: 'var(--color-text-muted)' }}>Practice:</div><div style={{ fontWeight: 800 }}>{s.practiceDone || 0}</div>
                <div style={{ color: 'var(--color-text-muted)' }}>Revision:</div><div style={{ fontWeight: 800 }}>{s.revisionDone || 0}</div>
                <div style={{ color: 'var(--color-text-muted)' }}>Other:</div><div style={{ fontWeight: 800 }}>{s.otherDone || 0}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <SmallGroupedBars values={[s.videoDone||0, s.practiceDone||0, s.revisionDone||0, s.otherDone||0]} />
              <div>
                <button className="btn" onClick={() => update(s.subject, { videoDone: (s.videoDone||0)+1 })}>+ video</button>
                <button className="btn" style={{ marginLeft: 6 }} onClick={() => update(s.subject, { practiceDone: (s.practiceDone||0)+1 })}>+ practice</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

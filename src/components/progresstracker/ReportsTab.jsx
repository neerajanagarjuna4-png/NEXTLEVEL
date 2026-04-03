import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function lastNDates(n) {
  const res = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); res.push(new Date(d));
  }
  return res;
}

export default function ReportsTab({ settings }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 6);
      const res = await api.get('/api/tracker/reports', { params: { weekStart: start.toISOString(), weekEnd: end.toISOString() } });
      const logs = (res.data && res.data.logs) ? res.data.logs : [];
      setData(logs);
    } catch (err) {
      console.error('Reports load', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const days = lastNDates(7);
  const labels = days.map(d => d.toLocaleDateString());
  const totals = days.map((d) => {
    const dayLogs = (data || []).filter(l => new Date(l.date).toDateString() === d.toDateString());
    return dayLogs.reduce((s, l) => s + (l.entries || []).reduce((ss,e)=>ss+(Number(e.hours)||0),0), 0);
  });

  const chartData = {
    labels,
    datasets: [{ label: 'Study hours', data: totals, backgroundColor: '#2563eb' }]
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Reports — Weekly Summary</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={load}>Refresh</button>
        </div>
      </div>
      {loading && <p>Loading…</p>}
      <div style={{ maxWidth: 900 }}>
        <Bar data={chartData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
      </div>

      <section style={{ marginTop: 18 }}>
        <h3>Overview</h3>
        <p>Total hours this week: {totals.reduce((a,b)=>a+b,0)}</p>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import SubjectSelector from './SubjectSelector';
import api from '../../utils/api';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';

const emptyEntry = () => ({ subject: '', hours: 0, activity: '', notes: '' });

export default function TrackerRowEditor({ row, onClose, onSave, settings }) {
  const [date, setDate] = useState(row?.date ? new Date(row.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10));
  const [entries, setEntries] = useState(row?.entries?.length ? row.entries : [emptyEntry()]);
  const [mentorRemarks, setMentorRemarks] = useState(row?.mentorRemarks || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row && row.entries && row.entries.length) setEntries(row.entries);
  }, [row]);

  const updateEntry = (idx, patch) => {
    setEntries(prev => prev.map((e,i) => i===idx ? { ...e, ...patch } : e));
  };

  const addEntry = () => setEntries(prev => [...prev, emptyEntry()]);
  const removeEntry = (i) => setEntries(prev => prev.filter((_,idx)=>idx!==i));

  const computeTotal = () => entries.reduce((s,e)=>s+(Number(e.hours)||0),0);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { date, entries, mentorRemarks };
      await api.post('/api/tracker/logs', payload);
      const s = getSocket(); if (s) s.emit('tracker-updated', {});
      if (onSave) onSave(payload);
      try {
        toast.success("Today's log saved ✓");
        const total = computeTotal();
        const efficiency = Math.round((total / Math.max(1, target)) * 100);
        toast.success(`Today's efficiency: ${efficiency}% 📊`);
      } catch (e) {}
    } catch (err) {
      console.error('Tracker save error', err);
    } finally { setSaving(false); }
  };

  const target = settings?.dailyTarget || 6;
  const total = computeTotal();

  return (
    <div style={{ position: 'fixed', left:0, top:0, right:0, bottom:0, background: 'rgba(0,0,0,0.4)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={save} style={{ background: 'var(--color-bg-card)', padding: 18, borderRadius: 12, width: 920, maxWidth: '96%', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3>{row && row._id ? 'Edit Day' : 'Add Day'}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ color: 'var(--color-text-muted)' }}>Target: {target}h</div>
            <div style={{ fontWeight: 700 }}>Total: {total}h</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <label style={{ flex: '0 0 200px' }}>Date
            <input className="input" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          </label>
          <label style={{ flex: 1 }}>Mentor Remarks
            <input className="input" type="text" value={mentorRemarks} onChange={(e)=>setMentorRemarks(e.target.value)} placeholder="Optional remarks" />
          </label>
        </div>

        <div style={{ maxHeight: 340, overflowY: 'auto', marginBottom: 12 }}>
          {entries.map((entry, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 120px 60px', gap: 8, alignItems: 'center', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 8 }}>
              <div>
                <SubjectSelector value={entry.subject} onChange={(v)=>updateEntry(idx, { subject: v })} />
              </div>
              <div>
                <input className="input" placeholder="Activity (e.g., Video + Notes)" value={entry.activity} onChange={(e)=>updateEntry(idx, { activity: e.target.value })} />
              </div>
              <div>
                <input className="input" type="number" min={0} step={0.25} value={entry.hours} onChange={(e)=>updateEntry(idx, { hours: Number(e.target.value) })} />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="btn" onClick={()=>removeEntry(idx)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button type="button" className="btn" onClick={addEntry}>+ Add Entry</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Day'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

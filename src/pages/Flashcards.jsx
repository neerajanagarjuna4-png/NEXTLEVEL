import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Flashcards = () => {
  const { user } = useAuth();
  const [due, setDue] = useState([]);
  const [custom, setCustom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    if (user) loadCards();
    // eslint-disable-next-line
  }, [user]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/flashcards/due');
      if (res.data?.success) {
        setDue(res.data.due || []);
        setCustom(res.data.custom || []);
        setIndex(0);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const review = async (card, rating) => {
    try {
      setLoading(true);
      const cardId = card.cardId || card._id || card.id || String(index);
      await api.post('/api/flashcards/review', { cardId, rating });
      await loadCards();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const addCustom = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/api/flashcards/custom', { front, back, subject });
      setFront(''); setBack(''); setSubject('');
      await loadCards();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flashcards-page">
      <h2>Flashcards</h2>

      {loading && <p>Loading…</p>}

      <section style={{ marginBottom: 16 }}>
        <h3>Due Cards</h3>
        {due.length === 0 && <p>No scheduled cards are due right now.</p>}
        {due.length > 0 && (
          <div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className={`flip-card ${due[index]?.flipped ? 'flipped' : ''}`} onClick={() => setDue(prev => prev.map((c,i)=>i===index?{...c, flipped: !c.flipped}:c))} style={{ cursor: 'pointer' }}>
                <div className="flip-card-inner">
                  <div className="flip-card-front card" style={{ width: 360, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ padding: 16 }}>{due[index].front}</div>
                  </div>
                  <div className="flip-card-back card" style={{ width: 360, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ padding: 16 }}>{due[index].back}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontWeight: 700 }}>Card ID: {due[index].cardId || due[index]._id || index}</div>
                <div>Next review: {new Date(due[index].nextReviewDate || Date.now()).toLocaleDateString()}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0,1,2,3,4,5].map(r => (
                    <button key={r} onClick={() => review(due[index], r)}>{r}</button>
                  ))}
                </div>
                <div>
                  <button onClick={() => setIndex((i) => (i + 1) % due.length)}>Next</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginBottom: 16 }}>
        <h3>Custom Cards</h3>
        <form onSubmit={addCustom} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 600 }}>
          <input placeholder="Front (question)" value={front} onChange={(e) => setFront(e.target.value)} required />
          <input placeholder="Back (answer)" value={back} onChange={(e) => setBack(e.target.value)} required />
          <input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <div>
            <button type="submit" disabled={loading}>Add Card</button>
            <button type="button" onClick={loadCards} style={{ marginLeft: 8 }}>Refresh</button>
          </div>
        </form>

        <div style={{ marginTop: 12 }}>
          {custom.length === 0 && <p>No custom cards yet.</p>}
          {custom.length > 0 && (
            <ul>
              {custom.map((c, i) => (
                <li key={c._id || i}><strong>{c.front}</strong> — {c.back}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Flashcards;

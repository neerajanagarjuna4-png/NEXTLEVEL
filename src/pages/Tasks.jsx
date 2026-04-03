import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // placeholder - fetch tasks when backend endpoint exists
    setTasks([{ id:1, title: 'Daily revision: Networks', done:false }, { id:2, title: 'Solve 10 PYQs', done:false }]);
  }, [user]);

  const toggle = (id) => setTasks(prev => prev.map(t => t.id===id?{...t, done:!t.done}:t));

  return (
    <div>
      <h2>Today's Tasks</h2>
      <div className="card">
        <ul>
          {tasks.map(t=> (
            <li key={t.id}><label><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} /> {t.title}</label></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

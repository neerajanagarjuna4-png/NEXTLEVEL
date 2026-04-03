import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export let socket = null;

export function connectSocket(user) {
  if (socket) return socket;
  const url = import.meta.env.VITE_SOCKET_URL || window.location.origin;
  socket = io(url, { transports: ['websocket'], auth: { token: localStorage.getItem('token') } });

  socket.on('connect', () => console.log('Socket connected', socket.id));
  socket.on('disconnect', () => console.log('Socket disconnected'));

  // Join appropriate room
  if (user) {
    if (user.role === 'mentor') socket.emit('join-mentor-room');
    if (user.role === 'student' && user._id) socket.emit('join-student-room', user._id);
  }

  // Friendly, user-visible toasts for common realtime events
  socket.on('points-updated', (p) => {
    try { if (p && typeof p.points !== 'undefined') toast.success(`+${p.points} points`); } catch (e) {}
  });

  socket.on('tokens-updated', (p) => {
    try { if (p && typeof p.tokens !== 'undefined') toast.success(`Streak Freeze tokens: ${p.tokens}`); } catch (e) {}
  });

  socket.on('streak-token-used', (p) => {
    try { toast.success('Streak Freeze used! Your streak is safe 🧊'); } catch (e) {}
  });

  socket.on('badge-earned', (payload) => {
    try { if (payload && payload.name) toast.success(`${payload.name} unlocked! 🏆`); } catch (e) {}
  });

  socket.on('challenge-correct', (payload) => {
    try { toast.success('+2 challenge points! 🎯'); } catch (e) {}
  });

  return socket;
}

export function getSocket() { return socket; }

export function disconnectSocket() { if (socket) { socket.disconnect(); socket = null; } }

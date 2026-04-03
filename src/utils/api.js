import axios from 'axios';
import toast from 'react-hot-toast';

// Normalize base host: strip any trailing `/api` so callers can use `/api/...` paths
const rawUrl = import.meta.env.VITE_API_URL || '';
// Default to the canonical Render backend hostname if Vite envs are missing.
const baseHost = (rawUrl && String(rawUrl).trim())
  ? String(rawUrl).replace(/\/api\/?$/i, '')
  : 'https://nextlevel-backend.onrender.com';

const api = axios.create({
  baseURL: baseHost
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use((res) => res, (err) => {
  if (!err.response) {
    toast.error('Connection error. Check your internet.');
    return Promise.reject(err);
  }
  if (err.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
  toast.error(msg);
  return Promise.reject(err);
});

export default api;

import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { startKeepAlive } from './utils/keepAlive'

// Set globally so all relative `/api` calls route to the backend in production.
// If `VITE_API_URL` is missing or empty (frontend deployed without envs),
// fall back to the Render backend URL so the site remains functional.
{
  const rawUrl = import.meta.env.VITE_API_URL || '';
  const baseHost = (rawUrl && String(rawUrl).trim())
    ? String(rawUrl).replace(/\/api\/?$/i, '')
    : 'https://nextlevel-0xw2.onrender.com';
  axios.defaults.baseURL = baseHost;
}

// Initialize theme from localStorage so UI matches user's preference on load
try {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
} catch (e) {
  // ignore (e.g., during server-side rendering or restricted environments)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
    {/* Start periodic keep-alive pings to prevent Render free-tier from sleeping */}
    {typeof window !== 'undefined' && startKeepAlive()}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    />
  </React.StrictMode>
)

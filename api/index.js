import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import serverless from 'serverless-http';

// Routes (relative to api/ directory)
import authRoutes from '../backend/routes/auth.js';
import studentRoutes from '../backend/routes/student.js';
import mentorRoutes from '../backend/routes/mentor.js';
import leaderboardRoutes from '../backend/routes/leaderboard.js';

// ─── Express App ────────────────────────────────────────────
const app = express();

// ─── CORS ───────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Vercel SSR, etc.)
    if (!origin) return callback(null, true);
    // Allow all vercel.app subdomains + localhost
    if (origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    // Allow any origin in production for now
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB Connection (Vercel Serverless Caching) ─────────
// Cache the connection promise globally so warm invocations reuse it.
// This is the official Vercel + Mongoose pattern.
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set in environment variables');
    return null;
  }

  // Return cached connection if still alive
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 8000,
      family: 4
    }).then((m) => {
      console.log('MongoDB connected');
      return m;
    }).catch((err) => {
      console.error('MongoDB connection failed:', err.message);
      cached.promise = null; // Allow retry on next invocation
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.conn = null;
    return null;
  }
}

// ─── Health Check (NO DB required) ──────────────────────────
// This is before the DB middleware so it always responds instantly.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongoState: mongoose.connection.readyState,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET
  });
});

// ─── DB Connection Middleware ───────────────────────────────
// Every /api/* route (except health) connects to DB first.
app.use('/api', async (req, res, next) => {
  // Skip health check (already handled above)
  if (req.path === '/health') return next();

  try {
    const conn = await connectDB();
    if (!conn) {
      return res.status(503).json({
        error: true,
        message: 'Database unavailable. Check MONGODB_URI env var and Atlas IP whitelist (0.0.0.0/0).'
      });
    }
    next();
  } catch (err) {
    return res.status(503).json({
      error: true,
      message: 'Database connection failed.',
      detail: err.message
    });
  }
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ─── 404 for unknown API routes ─────────────────────────────
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({
    error: true,
    message: `Not found: ${req.method} ${req.originalUrl}`
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: true, message: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(400).json({ error: true, message: `Duplicate value for ${field}.` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: true, message: 'Invalid ID format.' });
  }

  res.status(err.status || 500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message
  });
});

// ─── Export for Vercel Serverless ────────────────────────────
// serverless-http wraps Express into a proper Vercel-compatible handler.
// This is the battle-tested pattern that correctly handles request/response lifecycle.
export default serverless(app);

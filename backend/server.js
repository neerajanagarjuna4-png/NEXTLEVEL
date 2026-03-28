import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import serverlessHttp from 'serverless-http';

// Routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import mentorRoutes from './routes/mentor.js';
import leaderboardRoutes from './routes/leaderboard.js';

// Services
import { initCronJobs } from './services/cronJobs.js';

// Load env
dotenv.config();

// ─── Validate Required Environment Variables ─────────────────
const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`❌ Missing required environment variable: ${v}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

const app = express();

// ─── CORS ───────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://next-level-by-bhima-sankar-sir-mentoring.vercel.app',
  'https://nextlevel-snowy.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o) || origin.includes('vercel.app'))) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(null, true); // Allow all in dev; tighten in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  }
  next();
});

// ─── MongoDB Connection (Cached for Serverless) ─────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextlevel';
const PORT = process.env.PORT || 5000;
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    isConnected = false;
  }
};

// Ensure DB is connected before any API route
app.use('/api', async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ─── 404 Handler for API ────────────────────────────────────
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ error: true, message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: true, message: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(400).json({ error: true, message: `Duplicate value for ${field}.` });
  }

  // MongoDB cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: true, message: 'Invalid ID format.' });
  }

  res.status(err.status || 500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message
  });
});

// ─── Standalone Server Start ────────────────────────────────
if (!process.env.VERCEL) {
  connectDB().then(() => {
    initCronJobs();
    app.listen(PORT, () => {
      console.log(`🚀 NEXT_LEVEL Backend running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api/health`);
    });
  });
}

// ─── Serverless Export (for Vercel) ─────────────────────────
export default serverlessHttp(app);


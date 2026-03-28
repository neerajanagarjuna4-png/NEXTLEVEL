import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

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
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
let cachedDb = null;
let lastDbError = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  if (!MONGODB_URI) {
    lastDbError = "MONGODB_URI environment variable is MISSING on Vercel.";
    console.error(lastDbError);
    return null;
  }

  try {
    console.log('Attempting MongoDB connection...');
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Fail fast (3s)
      socketTimeoutMS: 5000,
      family: 4 // Force IPv4
    });
    cachedDb = conn;
    lastDbError = null;
    console.log('✅ Connected to MongoDB');
    return conn;
  } catch (err) {
    lastDbError = err.message || JSON.stringify(err);
    console.error('❌ MongoDB connection failed:', lastDbError);
    // CRITICAL: Prevent hanging the Vercel event loop
    await mongoose.disconnect().catch(() => {});
    return null;
  }
};

// ─── Health Check ───────────────────────────────────────────
// Placed BEFORE DB middleware so it never hangs and proves Vercel is routing correctly
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    hasMongodbUri: !!process.env.MONGODB_URI,
    lastDbError: lastDbError,
    uptime: process.uptime()
  });
});

// Ensure DB is connected before any real API route
app.use('/api', async (req, res, next) => {
  // Promise.race to guarantee middleware never hangs the process
  let isTimeout = false;
  const timeoutPromise = new Promise(resolve => setTimeout(() => {
    isTimeout = true;
    resolve();
  }, 4000));
  
  await Promise.race([connectDB(), timeoutPromise]);
  
  if (isTimeout) {
    lastDbError = "Connection timeout (4s) - MongoDB Atlas likely rejecting Vercel IP. Check your MongoDB Atlas Network Access whitelist (Needs 0.0.0.0/0).";
    await mongoose.disconnect().catch(() => {});
  }
  
  next();
});

// (Health check was moved above DB middleware)

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

// ─── Vercel Serverless Export ───────────────────────────────
export default app;


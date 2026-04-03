import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Core JWT authentication middleware. Use as `protect` in routes.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: true, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: true, message: 'Access denied. Token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found. Token invalid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: true, message: 'Token expired. Please log in again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: true, message: 'Invalid token.' });
    }
    return res.status(500).json({ error: true, message: 'Authentication error.' });
  }
};

// Backwards-compatible alias used across routes
export const protect = requireAuth;

// Mentor-only middleware
export const mentorOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: true, message: 'Authentication required.' });
  if (req.user.role !== 'mentor') return res.status(403).json({ error: true, message: 'Mentor access required.' });
  next();
};

// Student-only middleware
export const studentOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: true, message: 'Authentication required.' });
  if (req.user.role !== 'student') return res.status(403).json({ error: true, message: 'Student access required.' });
  next();
};

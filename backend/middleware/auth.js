import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header, verifies it,
 * and attaches the user to req.user.
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

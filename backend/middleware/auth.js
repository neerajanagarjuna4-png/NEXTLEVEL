import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nextlevel_jwt_secret_2024';

// Middleware to protect routes - verifies JWT token
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to check if user is mentor
export const mentorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'mentor') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Mentor only.' });
  }
};

export { JWT_SECRET };

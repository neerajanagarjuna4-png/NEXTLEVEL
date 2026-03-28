/**
 * Role-based access control middleware.
 * Usage: requireRole(['student']) or requireRole(['mentor'])
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}.`
      });
    }
    next();
  };
};

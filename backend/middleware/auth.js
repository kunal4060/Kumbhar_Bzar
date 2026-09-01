const { getDB } = require('../utils/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // Token structure: "userId:role" or JSON token
    const parts = token.split(':');
    const userId = parts[0];
    const db = getDB();
    const user = db.users.find(u => u.id === userId);

    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workshopName: user.workshopName || null
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: `Access denied. Requires ${role} permissions.` });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireAuth,
  requireRole
};

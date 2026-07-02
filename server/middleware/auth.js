const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]) ||
    req.cookies?.token;

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }
  next();
};

module.exports = { generateToken, verifyToken, requireAdmin };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔑 protect authHeader:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⛔ No bearer token');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 protect token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔑 protect decoded:', decoded);

    const user = await User.findByPk(decoded.id);
    console.log('🔑 protect user:', user?.toJSON());

    if (!user) {
      console.log('⛔ User not found');
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('🔥 protect error:', err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.admin = (req, res, next) => {
  console.log('🔒 admin req.user.isAdmin:', req.user?.isAdmin);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  console.log('⛔ Admin only');
  res.status(401).json({ message: 'Admin only' });
};

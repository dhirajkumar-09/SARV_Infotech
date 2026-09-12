const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockStore = require('../data/mockStore');

/**
 * Middleware to verify JWT token and authenticate user.
 * Attaches authenticated user document to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_for_development'
    );

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      // In-memory fallback if MongoDB is not connected
      user = mockStore.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired',
    });
  }
};

/**
 * Middleware to restrict access to Admin role only.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required',
    });
  }
};

module.exports = { protect, admin };

// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Login
router.post('/login', authController.login);

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user || !user.is_active) {
        return res.status(403).json({ error: 'User not found or inactive' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

// Logout (client-side token removal)
router.post('/logout', authController.logout);

// Get user profile
router.get('/profile', authenticateToken, authController.getProfile);

// Update user profile
router.put('/profile', authenticateToken, authController.updateProfile);

// Change password
router.put('/change-password', authenticateToken, authController.changePassword);

// Middleware to require super admin role
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};

// Middleware to check permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'super_admin') {
      return next(); // Super admin has all permissions
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission) && !req.user.permissions.includes('all')) {
      return res.status(403).json({ error: `Permission '${permission}' required` });
    }
    
    next();
  };
};

module.exports = { router, authenticateToken, requireSuperAdmin, requirePermission };
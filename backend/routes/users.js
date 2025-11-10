const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('./auth');
const { authLimiter } = require('../middleware/security');
const usersController = require('../controllers/usersController');

// Get all users (Super Admin only)
router.get('/', authenticateToken, requireSuperAdmin, usersController.getAllUsers);

// Get single user
router.get('/:id', authenticateToken, requireSuperAdmin, usersController.getUserById);

// Create new user (Super Admin only)
router.post('/', 
  process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next(),
  authenticateToken, 
  requireSuperAdmin, 
  usersController.createUser
);

// Update user (Super Admin only)
router.put('/:id', authenticateToken, requireSuperAdmin, usersController.updateUser);

// Delete user (Super Admin only)
router.delete('/:id', authenticateToken, requireSuperAdmin, usersController.deleteUser);

// Toggle user status (Super Admin only)
router.patch('/:id/toggle-status', authenticateToken, requireSuperAdmin, usersController.toggleUserStatus);

// Reset user password (Super Admin only)
router.patch('/:id/reset-password', 
  process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next(),
  authenticateToken, 
  requireSuperAdmin, 
  usersController.resetUserPassword
);

module.exports = router;
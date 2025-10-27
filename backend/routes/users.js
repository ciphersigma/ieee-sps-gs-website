const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, requireSuperAdmin } = require('./auth');
const { authLimiter } = require('../middleware/security');

// Get all users (Super Admin only)
router.get('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { branch } = req.query;
    let query = { role: { $ne: 'super_admin' } };
    
    // Filter by branch if provided
    if (branch) {
      query.branch_id = branch;
    }
    
    const users = await User.find(query)
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('created_by', 'name email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (Super Admin only)
router.post('/', 
  process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next(),
  authenticateToken, 
  requireSuperAdmin, 
  async (req, res) => {
    try {
      const { email, password, name, role, branch, branch_id, permissions, profile, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      const userRole = role || 'branch_admin';
      const branchRoles = ['branch_admin', 'counsellor', 'chairperson', 'member'];
      
      if (branchRoles.includes(userRole) && !branch_id && !branch) {
        return res.status(400).json({ error: 'Branch ID is required for this role' });
      }

      // Create user
      const userData = {
        email,
        password,
        name,
        role: userRole,
        permissions: permissions || ['events'],
        created_by: req.user.id,
        profile: {
          phone: phone || '',
          ...profile
        }
      };

      // Set branch_id for branch-related roles
      if (branchRoles.includes(userRole)) {
        userData.branch_id = branch_id || branch;
      }

      const user = new User(userData);
      await user.save();

      res.status(201).json({
        message: 'User created successfully',
        id: user._id,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('User creation error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Update user (Super Admin only)
router.put('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { email, name, role, branch, branch_id, permissions, is_active, profile, phone, password } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent super admin modification
    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot modify super admin users' });
    }

    // Update fields
    if (email) user.email = email;
    if (name) user.name = name;
    if (role) user.role = role;
    if (branch_id || branch) user.branch_id = branch_id || branch;
    if (permissions) user.permissions = permissions;
    if (typeof is_active === 'boolean') user.is_active = is_active;
    if (profile || phone) {
      user.profile = { 
        ...user.profile, 
        ...profile,
        ...(phone && { phone })
      };
    }
    if (password) user.password = password;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete user (Super Admin only)
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent super admin deletion
    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot delete super admin users' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle user status (Super Admin only)
router.patch('/:id/toggle-status', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot modify super admin status' });
    }

    user.is_active = !user.is_active;
    await user.save();

    res.json({
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset user password (Super Admin only)
router.patch('/:id/reset-password', 
  process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next(),
  authenticateToken, 
  requireSuperAdmin, 
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role === 'super_admin') {
        return res.status(403).json({ error: 'Cannot reset super admin password' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
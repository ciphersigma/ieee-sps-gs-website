const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Public endpoint to create super admin (for initial setup only)
router.post('/create-super-admin', async (req, res) => {
  try {
    // Check if any super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      return res.status(400).json({ 
        error: 'Super admin already exists. Use regular authentication.' 
      });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Create super admin
    const superAdmin = new User({
      email,
      password,
      name,
      role: 'super_admin',
      permissions: ['all'],
      is_active: true
    });

    await superAdmin.save();

    res.status(201).json({
      message: 'Super admin created successfully',
      user: {
        id: superAdmin._id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role
      }
    });

  } catch (error) {
    console.error('Super admin creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Public endpoint to create any user (for testing - remove in production)
router.post('/create-user', async (req, res) => {
  try {
    const { email, password, name, role = 'branch_admin', branch_id } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    const userData = {
      email,
      password,
      name,
      role,
      permissions: role === 'super_admin' ? ['all'] : ['events'],
      is_active: true
    };

    // Add branch_id for branch roles
    const branchRoles = ['branch_admin', 'counsellor', 'chairperson', 'member'];
    if (branchRoles.includes(role) && branch_id) {
      userData.branch_id = branch_id;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        branch_id: user.branch_id
      }
    });

  } catch (error) {
    console.error('User creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all users (public for testing - remove in production)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
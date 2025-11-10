const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authController = {
  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', { email, hasPassword: !!password });

      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      console.log('User found:', !!user);
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.is_active) {
        console.log('User account deactivated');
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      console.log('Password valid:', isPasswordValid);
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user data (without password)
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        branch_id: user.branch_id,
        permissions: user.permissions,
        last_login: user.last_login
      };

      res.json({
        success: true,
        token,
        user: userData
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get current user
  getCurrentUser: (req, res) => {
    const userData = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      organization: req.user.organization,
      branch_id: req.user.branch_id,
      permissions: req.user.permissions,
      last_login: req.user.last_login
    };

    res.json({ user: userData });
  },

  // Logout
  logout: (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  },

  // Get user profile
  getProfile: (req, res) => {
    const userData = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      organization: req.user.organization,
      branch_id: req.user.branch_id,
      permissions: req.user.permissions,
      created_at: req.user.created_at,
      last_login: req.user.last_login
    };

    res.json({ success: true, user: userData });
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken' });
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          name: name.trim(),
          email: email.toLowerCase().trim()
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        organization: updatedUser.organization,
        branch_id: updatedUser.branch_id,
        permissions: updatedUser.permissions
      };

      res.json({ success: true, user: userData, message: 'Profile updated successfully' });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      // Get user with password
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword; // This will be hashed by the pre-save middleware
      await user.save();

      res.json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;
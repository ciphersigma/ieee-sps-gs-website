// backend/routes/branches.js
const express = require('express');
const Branch = require('../models/Branch');
const User = require('../models/User');
const { authenticateToken, requireSuperAdmin } = require('./auth');
const router = express.Router();

// Public route - Get active student branches for student chapters page
router.get('/public/student-chapters', async (req, res) => {
  try {
    const branches = await Branch.find({ is_active: true })
      .select('name code college_name city district chairperson established_date member_count website')
      .sort({ name: 1 });
    
    res.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching student chapters:', error);
    res.status(500).json({ error: 'Failed to fetch student chapters' });
  }
});

// Get all branches
router.get('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate('chairperson.user_id', 'name email')
      .populate('counsellor.user_id', 'name email')
      .sort({ name: 1 });
    
    res.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get single branch
router.get('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate('chairperson.user_id', 'name email')
      .populate('counsellor.user_id', 'name email');
    
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json({ success: true, data: branch });
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({ error: 'Failed to fetch branch' });
  }
});

// Create new branch
router.post('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const branchData = req.body;
    
    // Check if branch code already exists
    const existingBranch = await Branch.findOne({ code: branchData.code.toUpperCase() });
    if (existingBranch) {
      return res.status(400).json({ error: 'Branch code already exists' });
    }
    
    const branch = new Branch(branchData);
    await branch.save();
    
    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// Update branch
router.put('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const branch = await Branch.findByIdAndUpdate(id, updateData, { new: true })
      .populate('chairperson.user_id', 'name email')
      .populate('counsellor.user_id', 'name email');
    
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json({ success: true, data: branch });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

// Toggle branch status
router.patch('/:id/toggle-status', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    branch.is_active = !branch.is_active;
    await branch.save();
    
    res.json({ success: true, data: branch });
  } catch (error) {
    console.error('Error toggling branch status:', error);
    res.status(500).json({ error: 'Failed to toggle branch status' });
  }
});

// Assign user to branch role
router.post('/:id/assign-role', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, user_id, name, email, phone } = req.body;
    
    if (!['chairperson', 'counsellor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    // Update branch role
    branch[role] = { name, email, phone, user_id };
    await branch.save();
    
    // Update user's branch assignment if user_id provided
    if (user_id) {
      await User.findByIdAndUpdate(user_id, { 
        branch_id: branch.code,
        role: role === 'chairperson' ? 'branch_admin' : 'counsellor'
      });
    }
    
    const updatedBranch = await Branch.findById(id)
      .populate('chairperson.user_id', 'name email')
      .populate('counsellor.user_id', 'name email');
    
    res.json({ success: true, data: updatedBranch });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

// Delete branch
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

module.exports = router;
// backend/routes/branches.js
const express = require('express');
const { authenticateToken, requireSuperAdmin } = require('./auth');
const branchesController = require('../controllers/branchesController');
const router = express.Router();

// Public route - Get active student branches for student chapters page
router.get('/public/student-chapters', branchesController.getPublicStudentChapters);

// Get all branches
router.get('/', authenticateToken, requireSuperAdmin, branchesController.getAllBranches);

// Get single branch
router.get('/:id', authenticateToken, requireSuperAdmin, branchesController.getBranchById);

// Create new branch
router.post('/', authenticateToken, requireSuperAdmin, branchesController.createBranch);

// Update branch
router.put('/:id', authenticateToken, requireSuperAdmin, branchesController.updateBranch);

// Toggle branch status
router.patch('/:id/toggle-status', authenticateToken, requireSuperAdmin, branchesController.toggleBranchStatus);

// Assign user to branch role
router.post('/:id/assign-role', authenticateToken, requireSuperAdmin, branchesController.assignRole);

// Delete branch
router.delete('/:id', authenticateToken, requireSuperAdmin, branchesController.deleteBranch);

module.exports = router;
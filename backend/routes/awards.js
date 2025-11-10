const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('./auth');
const { upload } = require('../config/cloudinary');
const awardsController = require('../controllers/awardsController');

// Public route - Get all active awards
router.get('/', awardsController.getPublicAwards);

// Admin routes
router.get('/admin', authenticateToken, requireSuperAdmin, awardsController.getAdminAwards);

router.post('/admin', authenticateToken, requireSuperAdmin, upload.single('image'), awardsController.createAward);

router.put('/admin/:id', authenticateToken, requireSuperAdmin, upload.single('image'), awardsController.updateAward);

router.delete('/admin/:id', authenticateToken, requireSuperAdmin, awardsController.deleteAward);

module.exports = router;
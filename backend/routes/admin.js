// routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('./auth');
const { upload } = require('../config/cloudinary');
const { uploadLimiter } = require('../middleware/security');
const adminController = require('../controllers/adminController');

// Carousel Routes
router.get('/carousel', adminController.getCarousel);
router.post('/carousel', 
  process.env.NODE_ENV === 'production' ? uploadLimiter : (req, res, next) => next(),
  authenticateToken,
  requireSuperAdmin,
  upload.single('image'), 
  adminController.createCarouselImage
);
router.put('/carousel/:id', 
  process.env.NODE_ENV === 'production' ? uploadLimiter : (req, res, next) => next(),
  authenticateToken,
  requireSuperAdmin,
  adminController.updateCarouselImage
);
router.delete('/carousel/:id', authenticateToken, requireSuperAdmin, adminController.deleteCarouselImage);

// Site Stats Routes
router.get('/stats', adminController.getStats);
router.put('/stats', authenticateToken, adminController.updateStats);

// User Roles Routes
router.get('/users', adminController.getUsers);
router.post('/users', authenticateToken, adminController.createUser);
router.put('/users/:id', authenticateToken, adminController.updateUser);

module.exports = router;
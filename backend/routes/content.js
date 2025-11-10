// routes/content.js
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// News Routes
router.get('/news', contentController.getNews);
router.post('/news', contentController.createNews);
router.put('/news/:id', contentController.updateNews);
router.delete('/news/:id', contentController.deleteNews);

// Gallery Routes
router.get('/gallery', contentController.getGallery);
router.post('/gallery', contentController.createGalleryImage);
router.delete('/gallery/:id', contentController.deleteGalleryImage);

// Achievements Routes
router.get('/achievements', contentController.getAchievements);
router.post('/achievements', contentController.createAchievement);

// Contact Messages Routes
router.get('/contact-messages', contentController.getContactMessages);
router.post('/contact-messages', contentController.createContactMessage);
router.put('/contact-messages/:id', contentController.updateContactMessage);

module.exports = router;
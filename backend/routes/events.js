// routes/events.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requirePermission } = require('./auth');
const { upload } = require('../config/cloudinary');
const eventsController = require('../controllers/eventsController');

// Get events (filtered by branch for branch users)
router.get('/', eventsController.getEvents);

// Create event
router.post('/', authenticateToken, requirePermission('events'), upload.single('image'), eventsController.createEvent);

// Update event
router.put('/:id', authenticateToken, requirePermission('events'), upload.single('image'), eventsController.updateEvent);

// Delete event
router.delete('/:id', authenticateToken, requirePermission('events'), eventsController.deleteEvent);

// Get events count
router.get('/count', eventsController.getEventsCount);

// Get single event by ID (must be after other specific routes)
router.get('/:id', eventsController.getEventById);

module.exports = router;
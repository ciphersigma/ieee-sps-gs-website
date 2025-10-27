// routes/events.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticateToken, requirePermission } = require('./auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  event_date: { type: Date, required: true },
  location: String,
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  image_url: String,
  registration_url: String,
  branch: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

// Get events (filtered by branch for branch users)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.upcoming === 'true') {
      filter.event_date = { $gte: new Date() };
    }
    
    // If authenticated user is provided, apply branch filtering
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const User = require('../models/User');
          const user = await User.findById(decoded.userId);
          
          // Branch users can only see their branch events
          if (user && ['branch_admin', 'chairperson', 'counsellor', 'member'].includes(user.role)) {
            filter.branch = user.branch_id;
          }
          // Super admins can see all events, or filter by specific branch if requested
          else if (req.query.branch) {
            filter.branch = req.query.branch;
          }
        } catch (jwtError) {
          // If token is invalid, continue without filtering (public access)
          if (req.query.branch) {
            filter.branch = req.query.branch;
          }
        }
      }
    } else if (req.query.branch) {
      // Public access with branch filter
      filter.branch = req.query.branch;
    }
    
    const events = await Event.find(filter)
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching events:', error);
    }
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/', authenticateToken, requirePermission('events'), upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image_url;
    
    // If file is uploaded, use Cloudinary
    if (req.file) {
      console.log('Uploading event image to Cloudinary...');
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'events');
        imageUrl = result.secure_url;
        console.log('Event image upload successful:', imageUrl);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({ error: 'Failed to upload image: ' + cloudinaryError.message });
      }
    }
    
    const eventData = {
      ...req.body,
      image_url: imageUrl,
      branch: req.user.role === 'super_admin' ? req.body.branch : req.user.branch_id,
      created_by: req.user._id
    };
    
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event
router.put('/:id', authenticateToken, requirePermission('events'), upload.single('image'), async (req, res) => {
  try {
    // Check if user can edit this event
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Branch users can only edit their own branch events
    if (['branch_admin', 'chairperson', 'counsellor', 'member'].includes(req.user.role) && existingEvent.branch !== req.user.branch_id) {
      return res.status(403).json({ error: 'You can only edit events from your branch' });
    }
    
    let updateData = { ...req.body };
    
    // If file is uploaded, use Cloudinary
    if (req.file) {
      console.log('Uploading updated event image to Cloudinary...');
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'events');
        updateData.image_url = result.secure_url;
        console.log('Event image update successful:', updateData.image_url);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({ error: 'Failed to upload image: ' + cloudinaryError.message });
      }
    }
    
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', authenticateToken, requirePermission('events'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Branch users can only delete their own branch events
    if (['branch_admin', 'chairperson', 'counsellor', 'member'].includes(req.user.role) && event.branch !== req.user.branch_id) {
      return res.status(403).json({ error: 'You can only delete events from your branch' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get events count
router.get('/count', async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event by ID (must be after other specific routes)
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching event:', error);
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../config/cloudinary');
const { Event } = require('../models/Website');

const eventsController = {
  // Get events (filtered by branch for branch users)
  getEvents: async (req, res) => {
    try {
      const filter = { is_active: true };
      if (req.query.status) filter.status = req.query.status;
      if (req.query.upcoming === 'true') {
        filter.event_date = { $gte: new Date() };
      }
      
      // Apply branch filtering based on user permissions
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const User = require('../models/User');
            const user = await User.findById(decoded.userId);
            
            // Branch users can only see their branch events
            if (user && user.role !== 'super_admin' && user.branch_id) {
              filter.branch = user.branch_id;
            } else if (req.query.branch) {
              filter.branch = req.query.branch;
            }
          } catch (jwtError) {
            // Public access - apply branch filter if provided
            if (req.query.branch) {
              filter.branch = req.query.branch;
            }
          }
        }
      } else if (req.query.branch) {
        filter.branch = req.query.branch;
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit) : 0;
      
      let query = Event.find(filter).sort({ event_date: -1, createdAt: -1 });
      if (limit > 0) {
        query = query.limit(limit);
      }
      
      const events = await query;
      res.json({ success: true, data: events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ success: false, error: error.message, data: [] });
    }
  },

  // Create event
  createEvent: async (req, res) => {
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
        branch: req.body.branch || (req.user ? req.user.branch_id : null)
      };
      
      const event = new Event(eventData);
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update event
  updateEvent: async (req, res) => {
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
  },

  // Delete event
  deleteEvent: async (req, res) => {
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
  },

  // Get events count
  getEventsCount: async (req, res) => {
    try {
      const count = await Event.countDocuments();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single event by ID
  getEventById: async (req, res) => {
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
  }
};

module.exports = eventsController;
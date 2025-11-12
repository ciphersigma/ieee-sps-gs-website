const { News, Gallery, Achievement, ContactMessage } = require('../models/Website');

const contentController = {
  // News
  getNews: async (req, res) => {
    try {
      const filter = { published: true }; // Only show published news by default
      
      // Allow admins to see unpublished content
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
          try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const User = require('../models/User');
            const user = await User.findById(decoded.userId);
            
            // Admins can see all news including unpublished
            if (user && ['super_admin', 'admin', 'branch_admin'].includes(user.role)) {
              delete filter.published;
              if (req.query.published === 'true') filter.published = true;
              if (req.query.published === 'false') filter.published = false;
            }
          } catch (jwtError) {
            // Continue with published filter for non-authenticated users
          }
        }
      }
      
      if (req.query.featured === 'true') filter.featured = true;
      
      const limit = req.query.limit ? parseInt(req.query.limit) : 0;
      
      let query = News.find(filter).sort({ createdAt: -1 });
      if (limit > 0) {
        query = query.limit(limit);
      }
      
      const news = await query;
      res.json({ success: true, data: news });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message, data: [] });
    }
  },

  createNews: async (req, res) => {
    try {
      const article = new News(req.body);
      await article.save();
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateNews: async (req, res) => {
    try {
      const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(article);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteNews: async (req, res) => {
    try {
      await News.findByIdAndDelete(req.params.id);
      res.json({ message: 'News article deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Gallery
  getGallery: async (req, res) => {
    try {
      const filter = {};
      if (req.query.featured === 'true') filter.featured = true;
      
      const images = await Gallery.find(filter).sort({ createdAt: -1 });
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createGalleryImage: async (req, res) => {
    try {
      const image = new Gallery(req.body);
      await image.save();
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteGalleryImage: async (req, res) => {
    try {
      await Gallery.findByIdAndDelete(req.params.id);
      res.json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Achievements
  getAchievements: async (req, res) => {
    try {
      const filter = {};
      if (req.query.category) filter.category = req.query.category;
      if (req.query.featured === 'true') filter.featured = true;
      
      const achievements = await Achievement.find(filter).sort({ date: -1 });
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createAchievement: async (req, res) => {
    try {
      const achievement = new Achievement(req.body);
      await achievement.save();
      res.status(201).json(achievement);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Contact Messages
  getContactMessages: async (req, res) => {
    try {
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
      
      const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createContactMessage: async (req, res) => {
    try {
      const message = new ContactMessage(req.body);
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateContactMessage: async (req, res) => {
    try {
      const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = contentController;
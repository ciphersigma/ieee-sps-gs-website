const { CarouselImage, SiteStats, UserRole, Event, News } = require('../models/Website');
const { uploadToCloudinary } = require('../config/cloudinary');
const User = require('../models/User');
const Branch = require('../models/Branch');

const adminController = {
  // Carousel
  getCarousel: async (req, res) => {
    try {
      const images = await CarouselImage.find({ is_active: true }).sort({ order: 1 });
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCarouselImage: async (req, res) => {
    try {
      console.log('Received file:', req.file ? 'Yes' : 'No');
      console.log('Request body:', req.body);
      
      let imageUrl = req.body.image_url;
      
      // If file is uploaded, use Cloudinary
      if (req.file) {
        console.log('Uploading image to Cloudinary...');
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'carousel');
          imageUrl = result.secure_url;
          console.log('Cloudinary upload successful:', imageUrl);
        } catch (cloudinaryError) {
          console.error('Cloudinary upload failed:', cloudinaryError);
          return res.status(500).json({ error: 'Failed to upload image: ' + cloudinaryError.message });
        }
      }
      
      const imageData = {
        ...req.body,
        image_url: imageUrl
      };
      
      const image = new CarouselImage(imageData);
      await image.save();
      res.status(201).json(image);
    } catch (error) {
      console.error('Carousel upload error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  updateCarouselImage: async (req, res) => {
    try {
      const image = await CarouselImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(image);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteCarouselImage: async (req, res) => {
    try {
      console.log('Deleting carousel image with ID:', req.params.id);
      const deletedImage = await CarouselImage.findByIdAndDelete(req.params.id);
      
      if (!deletedImage) {
        console.log('Image not found for deletion');
        return res.status(404).json({ error: 'Image not found' });
      }
      
      console.log('Image deleted successfully:', deletedImage._id);
      res.json({ message: 'Carousel image deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Site Stats
  getStats: async (req, res) => {
    try {
      let stats = await SiteStats.findOne();
      if (!stats) {
        stats = new SiteStats({
          total_members: 0,
          total_events: 0,
          total_publications: 0,
          total_projects: 0,
          page_views: 0
        });
        await stats.save();
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateStats: async (req, res) => {
    try {
      let stats = await SiteStats.findOne();
      if (!stats) {
        stats = new SiteStats(req.body);
      } else {
        Object.assign(stats, req.body);
        stats.last_updated = new Date();
      }
      await stats.save();
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // User Roles
  getUsers: async (req, res) => {
    try {
      const users = await UserRole.find({ is_active: true }).sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = new UserRole(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await UserRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Dashboard Stats
  getDashboardStats: async (req, res) => {
    try {
      const { branchId } = req.query;
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      let eventFilter = { is_active: true };
      let eventFilterLastMonth = { is_active: true, createdAt: { $lt: lastMonth } };
      
      if (branchId) {
        eventFilter.branch = branchId;
        eventFilterLastMonth.branch = branchId;
      }
      
      const [totalEvents, totalEventsLastMonth, totalBranches, totalMembers, totalUsers, totalNews] = await Promise.all([
        Event.countDocuments(eventFilter).catch(() => 0),
        Event.countDocuments(eventFilterLastMonth).catch(() => 0),
        Branch.countDocuments({ is_active: true }).catch(() => 0),
        UserRole.countDocuments({ role: 'member', is_active: true }).catch(() => 0),
        User.countDocuments({ is_active: true }).catch(() => 0),
        News.countDocuments({ published: true }).catch(() => 0)
      ]);
      
      // Calculate upcoming events
      const upcomingEvents = await Event.countDocuments({
        ...eventFilter,
        event_date: { $gte: now },
        status: { $in: ['upcoming', 'ongoing'] }
      }).catch(() => 0);
      
      // Calculate growth percentages
      const eventsGrowth = totalEventsLastMonth > 0 
        ? Math.round(((totalEvents - totalEventsLastMonth) / totalEventsLastMonth) * 100)
        : 0;
      
      const stats = {
        totalEvents,
        upcomingEvents,
        totalBranches,
        totalMembers,
        totalUsers,
        totalNews,
        systemActivity: totalEvents + totalBranches + totalUsers,
        recentActivity: totalEvents + totalNews,
        eventsGrowth: eventsGrowth > 0 ? `+${eventsGrowth}%` : `${eventsGrowth}%`
      };
      
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard statistics',
        data: {
          totalEvents: 0,
          upcomingEvents: 0,
          totalBranches: 0,
          totalMembers: 0,
          totalUsers: 0,
          totalNews: 0,
          systemActivity: 0,
          recentActivity: 0,
          eventsGrowth: '0%'
        }
      });
    }
  }
};

module.exports = adminController;
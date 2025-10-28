const express = require('express');
const router = express.Router();
const ViewCounter = require('../models/ViewCounter');

// Get view count
router.get('/views', async (req, res) => {
  try {
    let counter = await ViewCounter.findOne();
    if (!counter) {
      counter = new ViewCounter();
      await counter.save();
    }
    
    res.json({
      total_views: counter.total_views,
      unique_visitors: counter.unique_visitors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track a page view
router.post('/track', async (req, res) => {
  try {
    const { isUnique = false } = req.body;
    
    let counter = await ViewCounter.findOne();
    if (!counter) {
      counter = new ViewCounter();
    }
    
    // Increment total views
    counter.total_views += 1;
    
    // Increment unique visitors if it's a unique visit
    if (isUnique) {
      counter.unique_visitors += 1;
    }
    
    // Update daily views
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntry = counter.daily_views.find(entry => 
      entry.date.toDateString() === today.toDateString()
    );
    
    if (todayEntry) {
      todayEntry.views += 1;
    } else {
      counter.daily_views.push({
        date: today,
        views: 1
      });
      
      // Keep only last 30 days
      if (counter.daily_views.length > 30) {
        counter.daily_views = counter.daily_views.slice(-30);
      }
    }
    
    counter.last_updated = new Date();
    await counter.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
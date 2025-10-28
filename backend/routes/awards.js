const express = require('express');
const router = express.Router();
const Award = require('../models/Award');
const { authenticateToken, requireSuperAdmin } = require('./auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// Public route - Get all active awards
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find({ status: 'active' })
      .sort({ date: -1 })
      .populate('created_by', 'name');
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
router.get('/admin', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const awards = await Award.find()
      .sort({ createdAt: -1 })
      .populate('created_by', 'name');
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/admin', authenticateToken, requireSuperAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, recipient, category, date } = req.body;
    
    console.log('Creating award with data:', { title, description, recipient, category, date });
    console.log('User object:', req.user);
    console.log('User ID:', req.user._id || req.user.id);
    
    // Validate required fields
    if (!title || !description || !recipient || !category || !date) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['title', 'description', 'recipient', 'category', 'date'],
        received: { title: !!title, description: !!description, recipient: !!recipient, category: !!category, date: !!date }
      });
    }
    
    const userId = req.user._id || req.user.id || req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    
    const awardData = {
      title: title.trim(),
      description: description.trim(),
      recipient: recipient.trim(),
      category,
      date: new Date(date),
      created_by: userId
    };

    if (req.file) {
      console.log('Uploading image to Cloudinary...');
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'awards');
        awardData.image = result.secure_url;
        console.log('Cloudinary upload successful:', awardData.image);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({ error: 'Failed to upload image: ' + cloudinaryError.message });
      }
    }

    console.log('Final award data:', awardData);
    const award = new Award(awardData);
    await award.save();
    
    const populatedAward = await Award.findById(award._id).populate('created_by', 'name');
    res.status(201).json(populatedAward);
  } catch (error) {
    console.error('Error creating award:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error creating award', error: error.message });
  }
});

router.put('/admin/:id', authenticateToken, requireSuperAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, recipient, category, date, status } = req.body;
    
    const updateData = {
      title,
      description,
      recipient,
      category,
      date,
      status
    };

    if (req.file) {
      console.log('Uploading image to Cloudinary...');
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'awards');
        updateData.image = result.secure_url;
        console.log('Cloudinary upload successful:', updateData.image);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({ error: 'Failed to upload image: ' + cloudinaryError.message });
      }
    }

    const award = await Award.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('created_by', 'name');

    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    res.json(award);
  } catch (error) {
    res.status(400).json({ message: 'Error updating award', error: error.message });
  }
});

router.delete('/admin/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }
    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
// routes/content.js
const express = require('express');
const router = express.Router();
const { News, Gallery, Achievement, ContactMessage } = require('../models/Website');

// News Routes
router.get('/news', async (req, res) => {
  try {
    const filter = {};
    if (req.query.published === 'true') filter.published = true;
    if (req.query.featured === 'true') filter.featured = true;
    
    const news = await News.find(filter).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/news', async (req, res) => {
  try {
    const article = new News(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/news/:id', async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/news/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Gallery Routes
router.get('/gallery', async (req, res) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;
    
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/gallery', async (req, res) => {
  try {
    const image = new Gallery(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Achievements Routes
router.get('/achievements', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    
    const achievements = await Achievement.find(filter).sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/achievements', async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact Messages Routes
router.get('/contact-messages', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/contact-messages', async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/contact-messages/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
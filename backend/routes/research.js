// routes/research.js
const express = require('express');
const router = express.Router();
const { ResearchArea, ResearchProject, ResearchPublication, ResearchStats } = require('../models/Research');

// Research Areas Routes
router.get('/areas', async (req, res) => {
  try {
    const areas = await ResearchArea.find().sort({ createdAt: -1 });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/areas', async (req, res) => {
  try {
    const area = new ResearchArea(req.body);
    await area.save();
    res.status(201).json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/areas/:id', async (req, res) => {
  try {
    const area = await ResearchArea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/areas/:id', async (req, res) => {
  try {
    await ResearchArea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Area deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Research Projects Routes
router.get('/projects', async (req, res) => {
  try {
    const filter = req.query.featured === 'true' ? { featured: true } : {};
    const projects = await ResearchProject.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const project = new ResearchProject(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await ResearchProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await ResearchProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Research Publications Routes
router.get('/publications', async (req, res) => {
  try {
    const filter = req.query.featured === 'true' ? { featured: true } : {};
    const publications = await ResearchPublication.find(filter).sort({ year: -1 });
    res.json(publications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/publications', async (req, res) => {
  try {
    const publication = new ResearchPublication(req.body);
    await publication.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/publications/:id', async (req, res) => {
  try {
    const publication = await ResearchPublication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(publication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/publications/:id', async (req, res) => {
  try {
    await ResearchPublication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Research Stats Routes
router.get('/stats', async (req, res) => {
  try {
    let stats = await ResearchStats.findOne();
    if (!stats) {
      stats = new ResearchStats({
        total_projects: 60,
        total_publications: 130,
        total_collaborations: 25,
        total_awards: 15
      });
      await stats.save();
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/stats', async (req, res) => {
  try {
    let stats = await ResearchStats.findOne();
    if (!stats) {
      stats = new ResearchStats(req.body);
    } else {
      Object.assign(stats, req.body);
    }
    await stats.save();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
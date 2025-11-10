// routes/research.js
const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');

// Research Areas Routes
router.get('/areas', researchController.getAreas);
router.post('/areas', researchController.createArea);
router.put('/areas/:id', researchController.updateArea);
router.delete('/areas/:id', researchController.deleteArea);

// Research Projects Routes
router.get('/projects', researchController.getProjects);
router.post('/projects', researchController.createProject);
router.put('/projects/:id', researchController.updateProject);
router.delete('/projects/:id', researchController.deleteProject);

// Research Publications Routes
router.get('/publications', researchController.getPublications);
router.post('/publications', researchController.createPublication);
router.put('/publications/:id', researchController.updatePublication);
router.delete('/publications/:id', researchController.deletePublication);

// Research Stats Routes
router.get('/stats', researchController.getStats);
router.put('/stats', researchController.updateStats);

module.exports = router;
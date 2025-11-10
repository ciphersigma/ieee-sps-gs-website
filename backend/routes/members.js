// routes/members.js
const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');

// Members Routes
router.get('/', membersController.getMembers);
router.post('/', membersController.createMember);
router.put('/:id', membersController.updateMember);
router.delete('/:id', membersController.deleteMember);

// Executive Committee Routes
router.get('/executive', membersController.getExecutive);
router.post('/executive', membersController.createExecutive);
router.put('/executive/:id', membersController.updateExecutive);
router.delete('/executive/:id', membersController.deleteExecutive);

module.exports = router;
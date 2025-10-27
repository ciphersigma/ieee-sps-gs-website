// routes/members.js
const express = require('express');
const router = express.Router();
const { Member, ExecutiveCommittee } = require('../models/Website');

// Members Routes
router.get('/', async (req, res) => {
  try {
    let query = { is_active: true };
    
    // Check if user is authenticated and apply branch filtering
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const User = require('../models/User');
          const user = await User.findById(decoded.userId);
          
          // Branch users can only see their branch members
          if (user && ['branch_admin', 'chairperson', 'counsellor', 'member'].includes(user.role)) {
            query.branch_id = user.branch_id;
          }
        } catch (jwtError) {
          // Continue without filtering if token is invalid
        }
      }
    }
    
    const members = await Member.find(query).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let memberData = req.body;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const User = require('../models/User');
          const user = await User.findById(decoded.userId);
          
          // Branch users can only create members for their branch
          if (user && ['branch_admin', 'chairperson', 'counsellor', 'member'].includes(user.role)) {
            memberData.branch_id = user.branch_id;
          }
        } catch (jwtError) {
          // Continue without modification if token is invalid
        }
      }
    }
    
    const member = new Member(memberData);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Executive Committee Routes
router.get('/executive', async (req, res) => {
  try {
    let query = { is_active: true };
    
    // Check if user is authenticated and apply branch filtering
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const User = require('../models/User');
          const user = await User.findById(decoded.userId);
          
          // Branch users can only see their branch executives
          if (user && ['branch_admin', 'chairperson', 'counsellor', 'member'].includes(user.role)) {
            query.branch_id = user.branch_id;
          }
        } catch (jwtError) {
          // Continue without filtering if token is invalid
        }
      }
    }
    
    const committee = await ExecutiveCommittee.find(query).sort({ order: 1 });
    res.json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/executive', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let memberData = req.body;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const User = require('../models/User');
          const user = await User.findById(decoded.userId);
          
          // Branch users can only create executives for their branch
          if (user && ['branch_admin', 'chairperson', 'counsellor', 'member'].includes(user.role)) {
            memberData.branch_id = user.branch_id;
          }
        } catch (jwtError) {
          // Continue without modification if token is invalid
        }
      }
    }
    
    const member = new ExecutiveCommittee(memberData);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/executive/:id', async (req, res) => {
  try {
    const member = await ExecutiveCommittee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/executive/:id', async (req, res) => {
  try {
    await ExecutiveCommittee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Executive member deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
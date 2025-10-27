// backend/scripts/initUsers.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function initializeUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping initialization');
      return;
    }

    // Create initial users
    const users = [
      {
        email: 'prashantchettiyar@ieee.org',
        password: 'admin123',
        name: 'Prashant Chettiyar',
        role: 'super_admin',
        organization: 'IEEE SPS Gujarat',
        permissions: ['all']
      },
      {
        email: 'admin@daiict.ac.in',
        password: 'admin123',
        name: 'DAIICT Branch Admin',
        role: 'student_branch_admin',
        organization: 'DAIICT Student Branch',
        branch_id: 'daiict',
        permissions: ['events', 'members', 'content']
      },
      {
        email: 'admin@iitgn.ac.in',
        password: 'admin123',
        name: 'IIT Gandhinagar Branch Admin',
        role: 'student_branch_admin',
        organization: 'IIT Gandhinagar Student Branch',
        branch_id: 'iitgn',
        permissions: ['events', 'members', 'content']
      },
      {
        email: 'admin@nitsurat.ac.in',
        password: 'admin123',
        name: 'NIT Surat Branch Admin',
        role: 'student_branch_admin',
        organization: 'NIT Surat Student Branch',
        branch_id: 'nitsurat',
        permissions: ['events', 'members']
      }
    ];

    await User.insertMany(users);
    console.log('✅ Initial users created successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeUsers();
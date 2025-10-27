// backend/scripts/listUsers.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'email name role organization branch_id permissions is_active created_at');
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log(`Found ${users.length} users:`);
      console.log('');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Organization: ${user.organization || 'N/A'}`);
        console.log(`   Branch ID: ${user.branch_id || 'N/A'}`);
        console.log(`   Permissions: ${user.permissions.join(', ')}`);
        console.log(`   Active: ${user.is_active}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

listUsers();
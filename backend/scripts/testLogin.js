// backend/scripts/testLogin.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'prashantchettiyar@ieee.org';
    const password = 'admin123';

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.email);
    console.log('User active:', user.is_active);

    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);

    if (isPasswordValid) {
      console.log('✅ Login would succeed');
    } else {
      console.log('❌ Password incorrect');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testLogin();
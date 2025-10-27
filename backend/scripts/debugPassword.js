// backend/scripts/debugPassword.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function debugPassword() {
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

    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password);
    console.log('Testing password:', password);

    // Test bcrypt directly
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt compare:', isValid);

    // Test user method
    const isValidMethod = await user.comparePassword(password);
    console.log('User method compare:', isValidMethod);

    // Test with different password
    const testHash = await bcrypt.hash(password, 12);
    console.log('New hash for same password:', testHash);
    const testCompare = await bcrypt.compare(password, testHash);
    console.log('New hash comparison:', testCompare);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

debugPassword();
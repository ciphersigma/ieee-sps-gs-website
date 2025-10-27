// backend/scripts/fixPassword.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function fixPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'prashantchettiyar@ieee.org';
    const password = 'admin123';

    // Hash the password manually
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user directly in database
    const result = await User.updateOne(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Password updated successfully');
      
      // Test the login
      const user = await User.findOne({ email: email.toLowerCase() });
      const isValid = await user.comparePassword(password);
      console.log('Password test:', isValid ? '✅ Valid' : '❌ Invalid');
    } else {
      console.log('❌ No user updated');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

fixPassword();
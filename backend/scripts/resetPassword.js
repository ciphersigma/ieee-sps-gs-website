// backend/scripts/resetPassword.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'prashantchettiyar@ieee.org';
    const newPassword = 'admin123';

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    user.password = newPassword;
    await user.save();

    console.log('✅ Password reset successfully for:', email);
    console.log('New password:', newPassword);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

resetPassword();
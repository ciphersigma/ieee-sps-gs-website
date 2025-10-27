const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function debugLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'prashantchettiyar@ieee.org';
    const password = 'SuperAdmin123!';

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', !!user);
    
    if (user) {
      console.log('User details:');
      console.log('- Email:', user.email);
      console.log('- Name:', user.name);
      console.log('- Role:', user.role);
      console.log('- Active:', user.is_active);
      console.log('- Has password:', !!user.password);
      console.log('- Password length:', user.password ? user.password.length : 0);
      
      // Test password comparison
      if (user.password) {
        const isValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValid);
        
        // Also test the method
        const isValidMethod = await user.comparePassword(password);
        console.log('Password valid (method):', isValidMethod);
      }
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugLogin();
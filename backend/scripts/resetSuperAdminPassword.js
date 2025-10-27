const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function resetSuperAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'prashantchettiyar@ieee.org'; // Your super admin email
    const newPassword = 'SuperAdmin123!'; // New password

    // Find the super admin
    const superAdmin = await User.findOne({ email, role: 'super_admin' });
    
    if (!superAdmin) {
      console.log('❌ Super admin not found with email:', email);
      return;
    }

    // Update password
    superAdmin.password = newPassword;
    await superAdmin.save();

    console.log('✅ Super admin password reset successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 New Password:', newPassword);
    console.log('⚠️  Please change this password after login');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetSuperAdminPassword();
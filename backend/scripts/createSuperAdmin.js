const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      console.log('If you need to reset password, delete this user first');
      return;
    }

    // Create super admin
    const superAdminData = {
      name: 'Super Administrator',
      email: 'admin@ieeesps-gujarat.org', // Change this to your preferred email
      password: 'SuperAdmin123!', // Change this to your preferred password
      role: 'super_admin',
      permissions: ['all'],
      is_active: true
    };

    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email:', superAdminData.email);
    console.log('🔑 Password:', superAdminData.password);
    console.log('⚠️  Please change the password after first login');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createSuperAdmin();
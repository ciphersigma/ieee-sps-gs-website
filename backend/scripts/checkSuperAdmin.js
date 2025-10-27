const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function checkSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all super admins
    const superAdmins = await User.find({ role: 'super_admin' });
    
    console.log('Found super admins:', superAdmins.length);
    
    superAdmins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Super Admin:`);
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.name);
      console.log('   Active:', admin.is_active);
      console.log('   Created:', admin.createdAt);
      console.log('   Last Login:', admin.last_login || 'Never');
    });

    if (superAdmins.length === 0) {
      console.log('\n❌ No super admin found!');
      console.log('Run: node scripts/createSuperAdmin.js');
    } else {
      console.log('\n✅ Super admin(s) exist');
      console.log('If you cannot login, the password might be incorrect.');
      console.log('Run: node scripts/resetSuperAdminPassword.js');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkSuperAdmin();
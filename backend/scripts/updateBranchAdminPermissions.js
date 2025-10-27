const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function updateBranchAdminPermissions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all branch admins to remove carousel permission
    const result = await User.updateMany(
      { role: 'branch_admin' },
      { 
        $set: { 
          permissions: ['events'] // Only events permission for branch admins
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} branch admin users`);
    console.log('Branch admins now only have events permission');

    // Show current permissions
    const branchAdmins = await User.find({ role: 'branch_admin' }, 'name email branch permissions');
    console.log('\nCurrent branch admin permissions:');
    branchAdmins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.branch}): ${admin.permissions.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Error updating permissions:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateBranchAdminPermissions();
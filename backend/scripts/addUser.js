// backend/scripts/addUser.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function addUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get user input from command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 4) {
      console.log('Usage: node addUser.js <email> <password> <name> <role> [organization] [branch_id] [permissions]');
      console.log('Roles: super_admin, student_branch_admin, content_manager, event_manager');
      console.log('Permissions: events,members,content,settings (comma-separated) or "all" for super_admin');
      console.log('');
      console.log('Examples:');
      console.log('node addUser.js admin@example.com password123 "John Doe" super_admin "IEEE SPS Gujarat" "" all');
      console.log('node addUser.js branch@college.edu password123 "Branch Admin" student_branch_admin "College Branch" college events,members,content');
      process.exit(1);
    }

    const [email, password, name, role, organization = '', branch_id = '', permissions = ''] = args;

    // Validate role
    const validRoles = ['super_admin', 'student_branch_admin', 'content_manager', 'event_manager'];
    if (!validRoles.includes(role)) {
      console.error('Invalid role. Must be one of:', validRoles.join(', '));
      process.exit(1);
    }

    // Parse permissions
    let permissionsArray = [];
    if (permissions) {
      if (permissions === 'all') {
        permissionsArray = ['all'];
      } else {
        permissionsArray = permissions.split(',').map(p => p.trim());
      }
    } else if (role === 'super_admin') {
      permissionsArray = ['all'];
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.error('User with this email already exists');
      process.exit(1);
    }

    // Create user
    const userData = {
      email: email.toLowerCase(),
      password,
      name,
      role,
      permissions: permissionsArray
    };

    if (organization) userData.organization = organization;
    if (branch_id) userData.branch_id = branch_id;

    const user = new User(userData);
    await user.save();

    console.log('✅ User created successfully:');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('Organization:', user.organization || 'N/A');
    console.log('Branch ID:', user.branch_id || 'N/A');
    console.log('Permissions:', user.permissions.join(', '));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addUser();
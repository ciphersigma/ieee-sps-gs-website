const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'branch_admin', 'counsellor', 'chairperson', 'member', 'editor'],
    default: 'branch_admin'
  },
  branch_id: {
    type: String,
    required: function() { return ['branch_admin', 'counsellor', 'chairperson', 'member'].includes(this.role); },
    trim: true
  },
  organization: {
    type: String,
    trim: true,
    default: 'IEEE Signal Processing Society Gujarat Chapter'
  },
  permissions: [{
    type: String,
    enum: ['events', 'content', 'members', 'research', 'carousel', 'all']
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: Date,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  profile: {
    phone: String,
    institution: String,
    designation: String,
    bio: String
  }
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login method
userSchema.methods.updateLastLogin = async function() {
  this.last_login = new Date();
  return this.save();
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
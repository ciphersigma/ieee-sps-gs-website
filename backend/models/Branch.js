// backend/models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  college_name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  chairperson: {
    name: String,
    email: String,
    phone: String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  counsellor: {
    name: String,
    email: String,
    phone: String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  established_date: {
    type: Date
  },
  member_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

branchSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Branch', branchSchema);
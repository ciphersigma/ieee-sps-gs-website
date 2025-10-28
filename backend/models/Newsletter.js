const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  pdf_data: {
    type: String,
    required: true
  },
  pdf_filename: {
    type: String,
    required: true
  },
  cover_image: {
    type: String,
    default: null
  },
  publication_date: {
    type: Date,
    required: true
  },
  volume: {
    type: Number,
    required: true,
    min: 1
  },
  issue: {
    type: Number,
    required: true,
    min: 1
  },
  issue_number: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  download_count: {
    type: Number,
    default: 0
  },
  pdf_size: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create compound index for volume and issue uniqueness
newsletterSchema.index({ volume: 1, issue: 1 }, { unique: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
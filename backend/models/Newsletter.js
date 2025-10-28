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

module.exports = mongoose.model('Newsletter', newsletterSchema);
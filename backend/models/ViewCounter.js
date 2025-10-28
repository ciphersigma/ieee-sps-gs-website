const mongoose = require('mongoose');

const viewCounterSchema = new mongoose.Schema({
  total_views: {
    type: Number,
    default: 0
  },
  unique_visitors: {
    type: Number,
    default: 0
  },
  daily_views: [{
    date: {
      type: Date,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    }
  }],
  last_updated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ViewCounter', viewCounterSchema);
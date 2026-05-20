const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: ['LOGIN', 'LOGOUT', 'PROFILE_UPDATE', 'JOB_APPLY', 'JOB_POST', 'APPLICATION_STATUS_CHANGE'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  context: {
    type: mongoose.Schema.Types.Mixed, // flexible metadata
    default: {}
  }
}, { timestamps: true });

// Optimize for recent activity queries
logSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Log', logSchema);

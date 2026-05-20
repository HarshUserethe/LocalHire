const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  aspirantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'under_review', 'shortlisted', 'rejected', 'hired'],
    default: 'applied'
  },
  notes: {
    type: String, // Company notes
    select: false
  }
}, { timestamps: true });

// Fast lookups for an aspirant's applications
applicationSchema.index({ aspirantId: 1, createdAt: -1 });

// Fast lookups for a company viewing applicants for a job
applicationSchema.index({ jobId: 1, status: 1 });

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, aspirantId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

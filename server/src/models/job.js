const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // references the existing user model
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true
  },
  jobcity: {
    type: String,
    required: true
  },
  jobstate: {
    type: String
  },
  numberOfOpenings: {
    type: Number,
    default: 1
  },
  totalExperience: {
    type: String
  },
  monthlyInHandSalary: {
    type: Number
  },
  jobDescription: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  companyName: {
    type: String
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String,
    profile: String
  },
  organizationSize: {
    type: String
  },
  jobAddress: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  appliedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  shortlisted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  rejected: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
}, { timestamps: true });

// Optimize for querying and filtering
jobSchema.index({ userId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ jobcity: 1 });
jobSchema.index({ createdAt: -1 });

// Compound index for recommendations
jobSchema.index({ status: 1, jobcity: 1, skills: 1 });

module.exports = mongoose.model('job', jobSchema);

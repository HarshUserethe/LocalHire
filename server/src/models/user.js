const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() { return this.role === 'employee'; }
  },
  companyName: {
    type: String,
    required: function() { return this.role === 'company'; }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    select: false // Do not return password by default
  },
  role: {
    type: String,
    enum: ['employee', 'company', 'admin'],
    required: true
  },
  // Domain: Aspirant (Job Seeker) Profile
  aspirantProfile: {
    objective: String,
    skills: [{ type: String, trim: true }],
    education: [{
      degree: String,
      institution: String,
      year: Number,
      cgpa: Number
    }],
    experience: [{
      role: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String
    }],
    projects: [{
      name: String,
      startDate: Date,
      endDate: Date,
      description: String,
      link: String
    }],
    resumeLink: String,
    jobType: String,
    address: String
  },
  // Domain: Organization (Company) Profile
  organizationProfile: {
    description: String,
    website: String,
    location: String,
    industry: String,
    hiringRoles: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    credits: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/responseHandler');
const Job = require('../models/job');
const Application = require('../models/application');
const Log = require('../models/log');
const User = require('../models/user');

exports.getAspirantStats = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Aggregate stats directly from DB
  const stats = await Application.aggregate([
    { $match: { aspirantId: userId } },
    {
      $group: {
        _id: null,
        totalApplied: { $sum: 1 },
        activeApplications: {
          $sum: {
            $cond: [{ $in: ['$status', ['applied', 'under_review', 'shortlisted']] }, 1, 0]
          }
        },
        shortlisted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0]
          }
        }
      }
    }
  ]);

  const defaultStats = { totalApplied: 0, activeApplications: 0, shortlisted: 0 };
  
  sendResponse(res, 200, 'Stats fetched successfully', {
    stats: stats.length > 0 ? stats[0] : defaultStats
  });
});

exports.getRecentActivity = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 3;
  const skip = (page - 1) * limit;

  // Max 50 items per requested UX constraints
  const fetchLimit = Math.min(limit, 50);

  const logs = await Log.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(fetchLimit)
    .select('-__v');

  sendResponse(res, 200, 'Activity fetched successfully', { logs, page, limit: fetchLimit });
});

exports.getRecommendedJobs = catchAsync(async (req, res, next) => {
  const user = req.user;
  const profile = user.aspirantProfile || {};
  
  // Logic-driven recommendation
  const query = { status: 'active' };
  const orConditions = [];

  // Match skills if they exist
  if (profile.skills && profile.skills.length > 0) {
    orConditions.push({ skills: { $in: profile.skills } });
  }

  // Match preferred location
  if (profile.address) {
    orConditions.push({ jobcity: { $regex: profile.address, $options: 'i' } });
  }

  // Match Job Type
  if (profile.jobType) {
    orConditions.push({ jobType: profile.jobType });
  }

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  // Pagination for scalability
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const skip = (page - 1) * limit;

  const recommendedJobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  sendResponse(res, 200, 'Recommendations fetched successfully', { jobs: recommendedJobs });
});

exports.getApplications = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const applications = await Application.find({ aspirantId: userId })
    .populate({
      path: 'jobId',
      select: 'jobTitle companyName jobcity jobstate jobType'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  sendResponse(res, 200, 'Applications fetched successfully', { applications });
});

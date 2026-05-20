const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware.protect);

// Aspirant specific dashboard routes
router.get('/aspirant/stats', dashboardController.getAspirantStats);
router.get('/aspirant/recent-activity', dashboardController.getRecentActivity);
router.get('/aspirant/recommended-jobs', dashboardController.getRecommendedJobs);
router.get('/aspirant/applications', dashboardController.getApplications);

module.exports = router;

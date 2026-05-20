const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter specifically for profile updates
const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 update requests per window
  message: 'Too many profile update requests from this IP, please try again after 15 minutes'
});

// Protect all routes below
router.use(authMiddleware.protect);

// GET /api/v1/users/:id
router.get('/:id', userController.getUserData);

// PATCH /api/v1/users/:id/profile
router.patch('/:id/profile', profileUpdateLimiter, userController.updateProfile);

module.exports = router;

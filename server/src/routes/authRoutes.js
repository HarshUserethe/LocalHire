const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register/employee', authController.registerEmployee);
router.post('/register/company', authController.registerCompany);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/me', protect, authController.getMe);

module.exports = router;

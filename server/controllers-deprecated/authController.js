const userModel = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register user - OTP verification removed
exports.register = async (req, res) => {
  // Register logic
};

// Login user with email/phone and password
exports.login = async (req, res) => {
  // Login logic
};

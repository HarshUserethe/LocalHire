const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/responseHandler');
const logService = require('../services/logService');

const sendTokenResponse = (user, token, statusCode, res) => {
  // Set cookie options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user
  });
};

exports.registerEmployee = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return next(new AppError('All fields are required', 400));

  const { user, token } = await authService.registerUser(req.body, 'employee');
  sendTokenResponse(user, token, 201, res);
});

exports.registerCompany = catchAsync(async (req, res, next) => {
  const { companyName, email, password } = req.body;
  if (!companyName || !email || !password) return next(new AppError('All fields are required', 400));

  const { user, token } = await authService.registerUser(req.body, 'company');
  sendTokenResponse(user, token, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Email and password are required', 400));

  const { user, token } = await authService.loginUser(req.body);

  logService.createLog(user._id, 'LOGIN', 'User logged in successfully');

  sendTokenResponse(user, token, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  // User is attached to req by the protect middleware
  const user = req.user;
  res.status(200).json({
    success: true,
    data: user
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  if (req.user && req.user.id) {
    logService.createLog(req.user.id, 'LOGOUT', 'User logged out');
  }

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, data: {} });
});

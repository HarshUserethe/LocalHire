const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/responseHandler');
const User = require('../models/user');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'fallback_secret');
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

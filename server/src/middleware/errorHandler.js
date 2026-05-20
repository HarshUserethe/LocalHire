const logger = require('../utils/logger');
const { AppError } = require('../utils/responseHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
      const message = `Resource not found. Invalid: ${error.path}`;
      error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      const message = `Duplicate field value entered`;
      error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      error = new AppError(message, 400);
    }

    if (error.isOperational) {
      res.status(error.statusCode).json({
        success: false,
        status: error.status,
        message: error.message
      });
    } else {
      // Programming or other unknown error
      logger.error(`ERROR 💥: ${err}`);
      res.status(500).json({
        success: false,
        status: 'error',
        message: err.message || 'Something went very wrong!'
      });
    }
  }
};

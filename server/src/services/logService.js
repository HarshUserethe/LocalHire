const Log = require('../models/log');

exports.createLog = (userId, actionType, description, context = {}) => {
  // Fire and forget (non-blocking)
  Log.create({ userId, actionType, description, context })
    .catch(err => console.error('Failed to write log asynchronously:', err));
};

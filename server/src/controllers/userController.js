const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/responseHandler');
const logService = require('../services/logService');

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Ensure users can only update their own profile
  if (req.user.id !== id && req.user.role !== 'admin') {
    return sendResponse(res, 403, 'You are not authorized to update this profile');
  }

  const updates = req.body;
  
  // Exclude sensitive fields from being updated directly via this route
  delete updates.password;
  delete updates.role;
  delete updates.email;

  const updatedUser = await userService.updateUserById(id, updates);

  logService.createLog(id, 'PROFILE_UPDATE', 'User updated their profile information');

  sendResponse(res, 200, 'User profile updated successfully', { user: updatedUser });
});

exports.getUserData = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const user = await userService.getUserById(id);
  
  sendResponse(res, 200, 'User fetched successfully', { user });
});

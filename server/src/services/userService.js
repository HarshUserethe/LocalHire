const User = require('../models/user');
const { AppError } = require('../utils/responseHandler');

exports.updateUserById = async (userId, updateData) => {
  // Add validation or business logic here (e.g. preventing update of password via this route)
  if (updateData.password) {
    throw new AppError('This route is not for password updates. Please use the correct route.', 400);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  return updatedUser;
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId).lean();
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

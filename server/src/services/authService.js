const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/responseHandler');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET || 'fallback_secret', { expiresIn: '7d' });
};

exports.registerUser = async (userData, role) => {
  const { name, companyName, email, password } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('The email address is already in use.', 400);
  }

  const hashpassword = await bcrypt.hash(password, 10);

  const user = new User({
    name: role === 'employee' ? name : undefined,
    companyName: role === 'company' ? companyName : undefined,
    email,
    password: hashpassword,
    role,
    phone: `temp_${Date.now()}` // Bypass old DB schema unique phone index
  });

  await user.save();
  user.password = undefined; // Do not return password

  const token = generateToken(user._id);

  return { user, token };
};

exports.loginUser = async (credentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  user.password = undefined;
  const token = generateToken(user._id);

  return { user, token };
};

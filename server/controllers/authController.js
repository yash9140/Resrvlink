const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/responseHelper');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('An account with this email already exists.', 409));
    }

    const user = await User.create({ name, email, password, role: 'customer' });
    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 201, 'Account created successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return next(new AppError('User not found.', 404));
    }
    return sendSuccess(res, 200, 'Profile retrieved', user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile };

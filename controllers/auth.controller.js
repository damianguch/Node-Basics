const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult, matchedData } = require('express-validator');
const { hashPassword, comparePassword } = require('../utils/authHasher');

// @Desc Register a new user
// @Route POST /api/auth/register
// @Access Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array().map((error) => error.msg)
    });
  }

  const data = matchedData(req);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [data.email, data.username]
    });
    if (existingUser) {
      const takenField =
        existingUser.email === data.email ? 'Email' : 'Username';
      return res.status(400).json({
        success: false,
        error: `${takenField} is already taken`
      });
    }

    // Hash the password
    data.password = await hashPassword(data.password);

    // Create a new user
    const user = new User(data);

    // Save the user to the database
    const savedUser = await user.save();

    // Remove unwanted fields
    const {
      password: _,
      __v: __,
      updatedAt: ___,
      ...newUser
    } = savedUser.toObject();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`
    });
  }
};

// @Desc Login a user
// @Route POST /api/auth/login
// @Access Public
const loginUser = async (req, res) => {
  try {
    // Get the user credentials from the request body
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'User not found'
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create bearer token
    accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1h'
      }
    );

    // Modify the session data object
    req.session.auth = true;
    req.session.user = user;

    res
      .cookie('token', accessToken, {
        maxAge: 3600000, // 1 hour
        signed: true
      })
      .status(200)
      .json({
        success: true,
        message: 'User Login successfull',
        accessToken
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    // Get current logged in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if the old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // user.password = hashedPassword;
    // user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  changePassword
};

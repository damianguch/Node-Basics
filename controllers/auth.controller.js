const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// #desc Register a new user
// #route POST /api/auth/register
// #access Public
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the user already exists
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res
        .status(400)
        .json({ error: 'Email or Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      email,
      username,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

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

    res.status(200).json({
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

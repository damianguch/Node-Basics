const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

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

const loginUser = async (req, res) => {
  // Get the user credentials f
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
      expiresIn: '1hr'
    }
  );

  res.status(200).json({
    success: true,
    message: 'User Login successfull',
    accessToken
  });
};

module.exports = { loginUser, registerUser };

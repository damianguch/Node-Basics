const User = ['username', 'password'];
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  // Get the user credentials from the request body
  const { username, password } = req.body;

  // let user = await User.findOne({ username });
  let user = {
    _id: 222888000,
    username: 'johndoe',
    password: '1234',
    role: 'admin'
  };

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'User not found'
    });
  }

  //const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid = true;
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
      expiresIn: '30m'
    }
  );

  res.status(200).json({
    success: true,
    message: 'User Login successfull',
    accessToken
  });
};

module.exports = { loginUser };

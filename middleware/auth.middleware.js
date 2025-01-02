const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided'
    });
  }

  // Decode the token
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedTokenInfo;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `${error.message}`
    });
  }
};

module.exports = { isAuthenticated };

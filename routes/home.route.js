const express = require('express');
const { isAuthenticated } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/welcome', isAuthenticated, (req, res) => {
  const { username, role, userId } = req.userInfo;

  res.json({
    message: `Welcome ${username} to the home page`,
    user: {
      _id: userId,
      username,
      role
    }
  });
});

module.exports = router;

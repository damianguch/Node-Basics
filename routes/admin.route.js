const express = require('express');
const { isAdminUser } = require('../middleware/admin.middleware');
const { isAuthenticated } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/welcome', isAuthenticated, isAdminUser, (req, res) => {
  const { role } = req.userInfo;
  res.json({
    message: `Welcome to the ${role} page`,
    user: {
      _id: userId,
      username,
      role
    }
  });
});

module.exports = router;

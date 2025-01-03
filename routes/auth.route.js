const express = require('express');
const {
  loginUser,
  registerUser,
  changePassword
} = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const router = express.Router();

// Define the login page route
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/change-password', isAuthenticated, changePassword);

module.exports = router;

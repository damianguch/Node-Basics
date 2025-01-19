const express = require('express');
const {
  loginUser,
  registerUser,
  changePassword
} = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { createUserSchema } = require('../utils/validationSchemas');
const { checkSchema } = require('express-validator');
const router = express.Router();

// Define the login page route
router.post('/login', loginUser);
router.post('/register', checkSchema(createUserSchema), registerUser);
router.post('/change-password', isAuthenticated, changePassword);

module.exports = router;

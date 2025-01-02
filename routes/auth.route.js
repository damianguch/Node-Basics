const express = require('express');
const { loginUser, registerUser } = require('../controllers/auth.controller');
const router = express.Router();

// Define the login page route
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;

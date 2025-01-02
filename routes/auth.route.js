const express = require('express');
const { loginUser } = require('../controllers/auth.controller');
const router = express.Router();

// Define the login page route
router.post('/login', loginUser);

module.exports = router;

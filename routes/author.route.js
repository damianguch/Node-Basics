const express = require('express');
const { createAuthor } = require('../controllers/author.controller');
const router = express.Router();

router.post('/', createAuthor);

module.exports = router;

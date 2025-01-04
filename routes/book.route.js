const express = require('express');
const { createBook, getBook } = require('../controllers/book.controller');
const router = express.Router();

router.post('/', createBook);
router.get('/:id', getBook);

module.exports = router;

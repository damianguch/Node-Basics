const express = require('express');
const { query, body, checkSchema } = require('express-validator');
const {
  insertProduct,
  getProductStats,
  getProductAnalysis,
  getProducts,
  createProduct
} = require('../controllers/product.controller');
const { createProductSchema } = require('../utils/validationSchemas');
const router = express.Router();

router.post('/insert', insertProduct);
router.get('/stats', getProductStats);
router.get('/analysis', getProductAnalysis);

// Apply validation to the query string
router.get(
  '/',
  query('name')
    .isString()
    .notEmpty()
    .withMessage('Must not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Must be atleast 3-10 xters'),
  getProducts
);

// Apply validation to the request body
router.post('/', checkSchema(createProductSchema), createProduct);

module.exports = router;

const express = require('express');
const {
  insertProduct,
  getProductStats,
  getProductAnalysis
} = require('../controllers/product.controller');
const router = express.Router();

router.post('/insert', insertProduct);
router.get('/stats', getProductStats);
router.get('/analysis', getProductAnalysis);

module.exports = router;

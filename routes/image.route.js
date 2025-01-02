const express = require('express');
const { uploadImageHandler } = require('../controllers/image.controller');
const { isAdminUser } = require('../middleware/admin.middleware');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const router = express.Router();

// Modified middleware for dynamic selection
// upload.single (for single file uploads) or upload.array
// (for multiple file uploads).
router.post(
  '/upload',
  isAuthenticated,
  isAdminUser,
  (req, res, next) => {
    if (req.headers['upload-type'] === 'single') {
      upload.single('image')(req, res, next);
    } else {
      upload.array('image', 3)(req, res, next);
    }
  },
  uploadImageHandler
);

module.exports = router;

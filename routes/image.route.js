const express = require('express');
const {
  uploadImageHandler,
  fetchAllImages
} = require('../controllers/image.controller');
const { isAdminUser } = require('../middleware/admin.middleware');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const multer = require('multer');
const router = express.Router();

// Modified middleware for dynamic selection
// upload.single (for single file uploads) or upload.array
// (for multiple file uploads).
router.post(
  '/upload',
  isAuthenticated,
  isAdminUser,
  (req, res, next) => {
    upload.array('image', 3)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific error
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            error: 'Too many files uploaded. Maximum limit is 3 files.'
          });
        }
        // Handle other Multer errors if needed
        return res.status(400).json({
          success: false,
          error: `Multer error: ${err.message}`
        });
      } else if (err) {
        // Generic error
        return res.status(500).json({
          success: false,
          error: `Server error: ${err.message}`
        });
      }
      // Proceed to the next middleware if no error
      next();
    });
  },
  uploadImageHandler
);

router.get('/', isAuthenticated, fetchAllImages);

module.exports = router;

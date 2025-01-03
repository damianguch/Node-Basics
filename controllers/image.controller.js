const { uploadImage } = require('../helper/cloudinary');
Image = require('../models/image.model');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { cursorTo } = require('readline');

const uploadImageHandler = async (req, res) => {
  try {
    /**** HANDLE THE CASE FOR SINGLE FILE UPLOAD ****/
    // req.file is populated by upload.single() not upload.array(). So Update
    // the handler to consistently use req.files
    if (req.files && req.files.length === 1) {
      // Single file upload
      const file = req.files[0];

      // Pass the path property of the file object to uploadImage
      const { url, publicId } = await uploadImage(file.path);

      const newImage = new Image({
        url,
        publicId,
        uploadedBy: req.user.userId
      });

      await newImage.save();

      // Delete image from disk
      fs.unlinkSync(req.files[0].path);

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: newImage
      });
    }

    /*** HANDLE THE CASE FOR MULTIPLE FILE UPLOAD ***/

    // req.files is populated by upload.array middleware
    // If used, even for a single file, the uploaded file will be available
    // in req.files, not req.file. So update the handler to consistently use
    // req.files
    if (req.files && req.files.length > 1) {
      // Process and save multiple files
      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          let filePath = file.path;
          const { url, publicId } = await uploadImage(filePath);

          const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.user.userId
          });

          await newImage.save();
          return newImage;
        })
      );

      // delete images from disk
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(201).json({
        success: true,
        message: 'Images uploaded successfully',
        data: uploadedFiles
      });
    }

    // If no file is uploaded
    return res.status(400).json({
      success: false,
      error: 'No file was uploaded.'
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

const fetchAllImages = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (!images) {
      return res.status(400).json({
        success: false,
        error: 'No images found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Images fetched successfully',
      totalPages,
      totalImages,
      currentPage: page,
      data: images
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error.message}`
    });
  }
};

const deleteImage = async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.userId;

  try {
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Check if the user is the owner of the image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this image'
      });
    }

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete image from database
    await Image.findByIdAndDelete(imageId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error.message}`
    });
  }
};

module.exports = {
  uploadImageHandler,
  fetchAllImages,
  deleteImage
};

const { error } = require('console');
const { uploadImage } = require('../helper/cloudinary');
Image = require('../models/image.model');
const fs = require('fs');

const uploadImageHandler = async (req, res) => {
  try {
    // Handle the case for single file upload
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
        uploadedBy: req.userInfo.userId
      });

      await newImage.save();

      // Delete image from disk
      fs.unlinkSync(req.file.path);

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: newImage
      });
    }

    /**  Handle for multiple file uploads
     req.files is populated by upload.array middleware
     If used, even for a single file, the uploaded file will be available
     in req.files, not req.file. So Update the handler to consistently use 
     req.files
    */
    if (req.files && req.files.length > 1) {
      console.log(req.files);
      // Process and save multiple files
      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          let filePath = file.path;
          const { url, publicId } = await uploadImage(filePath);

          const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
          });

          await newImage.save();
          return newImage;
        })
      );

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
    const images = await Image.find({});

    if (!images) {
      return res.status(400).json({
        success: false,
        error: 'No imges found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Images fetched successfully',
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

module.exports = {
  uploadImageHandler,
  fetchAllImages
};

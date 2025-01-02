const { uploadImage } = require('../helper/cloudinary');
Image = require('../models/image.model');

const uploadImageHandler = async (req, res) => {
  try {
    // Handle for single file upload
    if (req.file) {
      console.log(req.file);

      // Pass the path property of the file object (from Multer) to
      // uploadImage
      const { url, publicId } = await uploadImage(req.file.path);

      const newImage = new Image({
        url,
        publicId,
        uploadedBy: req.userInfo.userId
      });

      await newImage.save();

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: newImage
      });
    }

    // Handle for multiple file uploads
    if (req.files || Object.keys(req.files).length > 0) {
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

module.exports = { uploadImageHandler };

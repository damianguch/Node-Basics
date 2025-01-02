const cloudinary = require('../config/cloudinary');

/** uploadImage function expects a file path not the file's binary content.
* 1. The cloudinary.uploader.upload() method requires the path to the file
* as an argument. It does not directly accept file buffers or streams.

2. To upload directly from binary content or streams, use Cloudinary's 
  upload_stream method instead.
*/
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Node-Images'
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.log(error);
    throw new Error(`${error.message}`);
  }
};

module.exports = { uploadImage };

/* 
1.Multer is a middleware for processing incoming 
multipart/form-data(used by browser for file upload). Primarily used for 
uploading files in node.js

2. It extracts files from the request body, saves it temporarily to the 
server's file system or memory, and provides them as req.file 
(for single uploads) or req.files (for multiple uploads). req.file or 
req.files is typically populated by middleware like multer with 
information about the uploaded file.

When a file is saved or processed using Multer, the file is written to a temporary
directory on the server. The server stores the file as a standard binary 
file (e.g., image.jpg or document.pdf). req.file contains metadata about 
the file, including its temporary path (file.path). req.file might look like
this:

{
  fieldname: 'image',
  originalname: 'example.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: './uploads/',
  filename: 'example-123456.jpg',
  path: './uploads/example-123456.jpg',
  size: 2048
}

3. Multer can be configured to store files in a tempoary location(disk)
or to memory (buffer). From the disk, you access the file's path and metadata,
which is needed to upload the file to Cloudinary.

4. Memory Storage: If configured for memory storage, the file's binary data 
is stored in a buffer (file.buffer) instead of being saved to disk.

5. The resulting file object from Multer, can be passed to Cloudinary’s SDK
 or API for upload, which requires either a file path 
 (for disk-stored files) or a buffer (for in-memory files), 
 both of which Multer provides.

6. Multer can validate file types, sizes, or other properties before 
processing the file. This is helpful to enforce rules like allowing only
images under a certain size.
*/

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Multer Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  }
});

// Export the upload middleware
module.exports = { upload };

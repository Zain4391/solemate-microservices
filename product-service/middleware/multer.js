/**
 * @fileoverview Multer configuration for image uploads
 * @module middleware/upload
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import multer from 'multer';

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WEBP are allowed.'), false);
    }
  };

const upload = multer({
  storage: multer.memoryStorage(), // Store in memory for Supabase upload
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3, // Maximum 3 files per request
  },
  fileFilter: fileFilter,
});

// Export different upload configurations
export const uploadSingle = upload.single('image'); // Single image upload
export const uploadMultiple = upload.array('images', 3); // Multiple images (max 3)

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB.',
        Images: null,
        error: true
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum 3 images allowed.',
        Images: null,
        error: true
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected field name. Use "image" for single or "images" for multiple.',
        Images: null,
        error: true
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: error.message,
      Images: null,
      error: true
    });
  }

  next(error);
};

export default upload;
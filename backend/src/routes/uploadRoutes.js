import express from 'express';
import upload from '../config/upload.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Generate the public URL for the uploaded file
    // Assuming the server runs on localhost:5000 and serves static files from /uploads
    // Return a relative URL so that it works seamlessly with the frontend proxy
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

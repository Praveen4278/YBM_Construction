import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/auth';

const router = Router();

// On Vercel, use /tmp (writable). Locally use the uploads folder.
const uploadDir = process.env.VERCEL === '1'
  ? '/tmp/uploads'
  : path.resolve(process.cwd(), '..', 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create upload directory:', e);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and random number to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File validation helper
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.mov', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, PDF, and video formats (MP4, MOV, WEBM) are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos and brochures
  }
});

// @route   POST /api/upload
// @desc    Upload a file (image, video, or brochure PDF)
// @access  Protected (Admin only)
router.post('/', protect, upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Since our server serves '..' statically under '/static-assets', 
    // the uploaded file is accessible at '/static-assets/uploads/filename'
    const fileUrl = `/static-assets/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({ message: error.message || 'Server error uploading file' });
  }
});

export default router;

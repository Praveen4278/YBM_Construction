"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// On Vercel, use /tmp (writable). Locally use the uploads folder.
const uploadDir = process.env.VERCEL === '1'
    ? '/tmp/uploads'
    : path_1.default.resolve(process.cwd(), '..', 'uploads');
try {
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
}
catch (e) {
    console.warn('Could not create upload directory:', e);
}
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using timestamp and random number to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// File validation helper
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.mov', '.webm'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP, PDF, and video formats (MP4, MOV, WEBM) are allowed.'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos and brochures
    }
});
// @route   POST /api/upload
// @desc    Upload a file (image, video, or brochure PDF)
// @access  Protected (Admin only)
router.post('/', auth_1.protect, upload.single('file'), (req, res) => {
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
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: error.message || 'Server error uploading file' });
    }
});
exports.default = router;

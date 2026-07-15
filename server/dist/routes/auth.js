"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   POST /api/auth/login
// @desc    Authenticate admin user & get token
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }
    try {
        const user = await dataService_1.dataService.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ username: user.username }, auth_1.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({
            token,
            user: {
                username: user.username
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
// @route   POST /api/auth/register
// @desc    Register a new admin user
router.post('/register', auth_1.protect, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }
    try {
        const existingUser = await dataService_1.dataService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = await dataService_1.dataService.createUser(username, passwordHash);
        res.status(201).json({
            message: 'Admin user created successfully',
            username: newUser.username
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
// @route   GET /api/auth/me
// @desc    Get current user details from JWT token
router.get('/me', auth_1.protect, (req, res) => {
    if (req.user) {
        res.json({ username: req.user.username });
    }
    else {
        res.status(401).json({ message: 'Not authorized' });
    }
});
exports.default = router;

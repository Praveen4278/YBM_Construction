import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dataService } from '../config/dataService';
import { JWT_SECRET, protect, AuthRequest } from '../middleware/auth';

const router = Router();

// @route   POST /api/auth/login
// @desc    Authenticate admin user & get token
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    const user = await dataService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      token,
      user: {
        username: user.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new admin user
router.post('/register', protect, async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    const existingUser = await dataService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await dataService.createUser(username, passwordHash);

    res.status(201).json({
      message: 'Admin user created successfully',
      username: newUser.username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user details from JWT token
router.get('/me', protect, (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json({ username: req.user.username });
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
});

export default router;

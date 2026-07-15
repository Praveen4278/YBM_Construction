import { Router, Request, Response } from 'express';
import { dataService } from '../config/dataService';
import { protect } from '../middleware/auth';

const router = Router();

// @route   GET /api/settings
// @desc    Get website settings (Publicly accessible for layout/SEO injection)
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await dataService.getSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving settings' });
  }
});

// @route   PUT /api/settings
// @desc    Update website settings (Admin only)
router.put('/', protect, async (req: Request, res: Response) => {
  try {
    const updated = await dataService.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
});

export default router;

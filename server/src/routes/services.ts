import { Router, Request, Response } from 'express';
import { dataService } from '../config/dataService';
import { protect } from '../middleware/auth';

const router = Router();

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await dataService.getServices();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving services' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service (Admin only)
router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const updated = await dataService.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating service' });
  }
});

export default router;

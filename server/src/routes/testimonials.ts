import { Router, Request, Response } from 'express';
import { dataService } from '../config/dataService';
import { protect } from '../middleware/auth';

const router = Router();

// @route   GET /api/testimonials
// @desc    Get all testimonials
router.get('/', async (req: Request, res: Response) => {
  try {
    const testimonials = await dataService.getTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving testimonials' });
  }
});

// @route   POST /api/testimonials
// @desc    Create a new testimonial (Admin only)
router.post('/', protect, async (req: Request, res: Response) => {
  try {
    const test = await dataService.createTestimonial(req.body);
    res.status(201).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating testimonial' });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial (Admin only)
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const deleted = await dataService.deleteTestimonial(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully', deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting testimonial' });
  }
});

export default router;

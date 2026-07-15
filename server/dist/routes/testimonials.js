"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/testimonials
// @desc    Get all testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await dataService_1.dataService.getTestimonials();
        res.json(testimonials);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving testimonials' });
    }
});
// @route   POST /api/testimonials
// @desc    Create a new testimonial (Admin only)
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const test = await dataService_1.dataService.createTestimonial(req.body);
        res.status(201).json(test);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating testimonial' });
    }
});
// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial (Admin only)
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const deleted = await dataService_1.dataService.deleteTestimonial(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted successfully', deleted });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting testimonial' });
    }
});
exports.default = router;

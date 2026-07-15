"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
    try {
        const services = await dataService_1.dataService.getServices();
        res.json(services);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving services' });
    }
});
// @route   PUT /api/services/:id
// @desc    Update a service (Admin only)
router.put('/:id', auth_1.protect, async (req, res) => {
    try {
        const updated = await dataService_1.dataService.updateService(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating service' });
    }
});
exports.default = router;

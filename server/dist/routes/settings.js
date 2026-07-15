"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/settings
// @desc    Get website settings (Publicly accessible for layout/SEO injection)
router.get('/', async (req, res) => {
    try {
        const settings = await dataService_1.dataService.getSettings();
        res.json(settings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving settings' });
    }
});
// @route   PUT /api/settings
// @desc    Update website settings (Admin only)
router.put('/', auth_1.protect, async (req, res) => {
    try {
        const updated = await dataService_1.dataService.updateSettings(req.body);
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating settings' });
    }
});
exports.default = router;

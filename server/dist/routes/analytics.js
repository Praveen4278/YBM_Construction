"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/analytics
// @desc    Get dashboard summary statistics (Admin only)
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const projects = await dataService_1.dataService.getProjects();
        const submissions = await dataService_1.dataService.getSubmissions();
        const testimonials = await dataService_1.dataService.getTestimonials();
        // 1. Core counters
        const totalProjects = projects.length;
        const totalSubmissions = submissions.length;
        const quoteRequests = submissions.filter(s => s.type === 'quote').length;
        const contactRequests = submissions.filter(s => s.type === 'contact').length;
        // Submissions split by status
        const unreadSubmissions = submissions.filter(s => s.status === 'unread').length;
        // 2. Mock page views analytics dataset for Recharts rendering
        const pageViewsData = [
            { name: 'Mon', views: 320, leads: 4 },
            { name: 'Tue', views: 450, leads: 7 },
            { name: 'Wed', views: 560, leads: 9 },
            { name: 'Thu', views: 480, leads: 5 },
            { name: 'Fri', views: 610, leads: 12 },
            { name: 'Sat', views: 380, leads: 8 },
            { name: 'Sun', views: 420, leads: 6 }
        ];
        // 3. Project type distribution
        const residentialCount = projects.filter(p => p.type === 'residential').length;
        const commercialCount = projects.filter(p => p.type === 'commercial').length;
        res.json({
            counters: {
                projects: totalProjects,
                submissions: totalSubmissions,
                quotes: quoteRequests,
                contacts: contactRequests,
                unread: unreadSubmissions,
                testimonials: testimonials.length
            },
            charts: {
                pageViews: pageViewsData,
                distribution: [
                    { name: 'Residential', value: residentialCount },
                    { name: 'Commercial', value: commercialCount }
                ]
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating analytics' });
    }
});
exports.default = router;

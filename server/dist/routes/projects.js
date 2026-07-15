"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await dataService_1.dataService.getProjects();
        res.json(projects);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving projects' });
    }
});
// @route   GET /api/projects/:id
// @desc    Get project by ID or slug
router.get('/:id', async (req, res) => {
    try {
        const project = await dataService_1.dataService.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving project details' });
    }
});
// @route   POST /api/projects
// @desc    Create a new project (Admin only)
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const newProject = await dataService_1.dataService.createProject(req.body);
        res.status(201).json(newProject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating project' });
    }
});
// @route   PUT /api/projects/:id
// @desc    Update an existing project (Admin only)
router.put('/:id', auth_1.protect, async (req, res) => {
    try {
        const updated = await dataService_1.dataService.updateProject(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating project' });
    }
});
// @route   DELETE /api/projects/:id
// @desc    Delete a project (Admin only)
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const deleted = await dataService_1.dataService.deleteProject(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully', deleted });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting project' });
    }
});
exports.default = router;

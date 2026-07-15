import { Router, Request, Response } from 'express';
import { dataService } from '../config/dataService';
import { protect } from '../middleware/auth';

const router = Router();

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await dataService.getProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving projects' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID or slug
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await dataService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving project details' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project (Admin only)
router.post('/', protect, async (req: Request, res: Response) => {
  try {
    const newProject = await dataService.createProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update an existing project (Admin only)
router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const updated = await dataService.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project (Admin only)
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const deleted = await dataService.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully', deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

export default router;

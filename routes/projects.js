const express = require('express');
const router = express.Router();

// In-memory project store
let projects = [];
let nextId = 1;

// GET /projects
router.get('/', (req, res) => {
  res.json(projects);
});

// GET /projects/:id
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST /projects
router.post('/', (req, res) => {
  const { name, description, status } = req.body;

  // Minor issue: no input validation at all
  const project = {
    id: nextId++,
    name,
    description,
    status: status || 'active',
    tasks: [],
    createdAt: new Date().toISOString()
  };
  projects.push(project);
  res.status(201).json(project);
});

// PUT /projects/:id
router.put('/:id', (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  // Minor issue: overwrites entire object without preserving id/createdAt
  project.name = req.body.name;
  project.description = req.body.description;
  project.status = req.body.status;

  res.json(project);
});

// DELETE /projects/:id
router.delete('/:id', (req, res) => {
  const index = projects.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  projects.splice(index, 1);
  res.status(204).send();
});

// POST /projects/:id/tasks - add a task reference to a project
router.post('/:id/tasks', (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  // Minor issue: no validation on taskId, no check if task actually exists
  const { taskId } = req.body;
  project.tasks.push(taskId);
  res.json(project);
});

module.exports = router;

const express = require('express');
const router = express.Router();

// In-memory task store
let tasks = [];
let nextId = 1;

// Validate task input — returns an error string or null
function validateTask(body) {
  const { title } = body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.trim().length > 200) {
    return 'Title must be 200 characters or less';
  }
  return null;
}

// GET /tasks?completed=true|false
router.get('/', (req, res) => {
  let result = tasks;
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    result = tasks.filter(t => t.completed === completed);
  }
  res.json(result);
});

// GET /tasks/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID' });

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /tasks
router.post('/', (req, res) => {
  const error = validateTask(req.body);
  if (error) return res.status(400).json({ error });

  const { title, description } = req.body;
  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? String(description).trim() : null,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PATCH /tasks/:id
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID' });

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, completed } = req.body;
  if (title !== undefined) {
    const error = validateTask({ title });
    if (error) return res.status(400).json({ error });
    task.title = title.trim();
  }
  if (description !== undefined) task.description = String(description).trim();
  if (completed !== undefined) task.completed = Boolean(completed);
  task.updatedAt = new Date().toISOString();

  res.json(task);
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID' });

  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

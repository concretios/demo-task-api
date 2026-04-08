const express = require('express');
const router = express.Router();

// In-memory task store
let tasks = [];
let nextId = 1;

// GET /tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /tasks
router.post('/', (req, res) => {
  const { title, description } = req.body;
  const task = {
    id: nextId++,
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PATCH /tasks/:id
router.patch('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  Object.assign(task, req.body);
  res.json(task);
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

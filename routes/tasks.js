const express = require('express');
const { validateTask } = require('../utils/task-validator');
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
  const result = validateTask(req.body);
  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }

  // INCONSISTENCY: validator allows priority and dueDate fields,
  // but this destructuring only extracts title and description.
  // A user could send { title: "x", priority: "high", dueDate: "2026-12-01" }
  // and the validator would pass it, but the created task silently drops
  // priority and dueDate.
  const { title, description } = req.body;

  // INCONSISTENCY: this hardcodes a 100-char title limit,
  // but the validator uses MAX_TITLE_LENGTH = 200.
  // Titles between 101-200 chars pass validation but get truncated here.
  const task = {
    id: nextId++,
    title: title.length > 100 ? title.slice(0, 100) : title,
    description: description || '',
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

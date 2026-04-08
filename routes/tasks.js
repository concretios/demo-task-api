const express = require('express');
const router = express.Router();

let tasks = [];
let nextId = 1;

const PAGE_SIZE_MAX = 100;
const PAGE_SIZE_DEFAULT = 20;

function parsePositiveInt(val, fallback) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// GET /tasks?page=1&limit=20&completed=true|false
router.get('/', (req, res) => {
  let result = tasks;

  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    result = result.filter(t => t.completed === completed);
  }

  const total = result.length;
  const limit = Math.min(parsePositiveInt(req.query.limit, PAGE_SIZE_DEFAULT), PAGE_SIZE_MAX);
  const page  = parsePositiveInt(req.query.page, 1);
  const offset = (page - 1) * limit;

  res.json({
    data: result.slice(offset, offset + limit),
    meta: { total, page, limit, pages: Math.ceil(total / limit) }
  });
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
  const { title, description } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Title must be 200 characters or less' });
  }
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
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    task.title = title.trim();
  }
  if (description !== undefined) task.description = description === null ? null : String(description).trim();
  if (completed !== undefined) task.completed = completed === true || completed === 'true';
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

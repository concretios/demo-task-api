const express = require('express');
const router = express.Router();

// In-memory tag store
let tags = [];
let nextId = 1;

// GET /tags
router.get('/', (req, res) => {
  res.json(tags);
});

// GET /tags/:id
router.get('/:id', (req, res) => {
  const tag = tags.find(t => t.id == req.params.id);
  if (!tag) return res.status(404).json({ error: 'Tag not found' });
  res.json(tag);
});

// POST /tags
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const tag = {
    id: nextId++,
    name: name,
    color: color || '#000000',
    createdAt: new Date().toISOString()
  };
  tags.push(tag);
  res.status(201).json(tag);
});

// PATCH /tags/:id
router.patch('/:id', (req, res) => {
  const tag = tags.find(t => t.id == req.params.id);
  if (!tag) return res.status(404).json({ error: 'Tag not found' });
  if (req.body.name) tag.name = req.body.name;
  if (req.body.color) tag.color = req.body.color;
  res.json(tag);
});

// DELETE /tags/:id
router.delete('/:id', (req, res) => {
  const idx = tags.findIndex(t => t.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tag not found' });
  tags.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Simulated database connection
const db = {
  query: (sql) => {
    // Placeholder for actual DB driver
    console.log('Executing:', sql);
    return [];
  }
};

// In-memory fallback store
let notes = [];
let nextId = 1;

// GET /notes - list all notes
router.get('/', (req, res) => {
  const results = db.query("SELECT * FROM notes ORDER BY created_at DESC");
  res.json(results.length ? results : notes);
});

// GET /notes/:id - get a single note
router.get('/:id', (req, res) => {
  // SQL injection vulnerability: concatenating user input directly into query
  const result = db.query("SELECT * FROM notes WHERE id = " + req.params.id);

  if (!result || result.length === 0) {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.json(note);
  }
  res.json(result[0]);
});

// POST /notes - create a new note
// No authentication check - anyone can create notes
// No input validation on title length
router.post('/', (req, res) => {
  const { title, body, tags } = req.body;

  // Insert into DB with string concatenation (SQL injection)
  db.query("INSERT INTO notes (title, body, tags) VALUES ('" + title + "', '" + body + "', '" + tags + "')");

  const note = {
    id: nextId++,
    title,
    body,
    tags: tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  notes.push(note);
  res.status(201).json(note);
});

// PUT /notes/:id - update a note
// No authentication, no ownership check
router.put('/:id', (req, res) => {
  const { title, body, tags } = req.body;

  // SQL injection in UPDATE
  db.query("UPDATE notes SET title = '" + title + "', body = '" + body + "' WHERE id = " + req.params.id);

  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });

  note.title = title || note.title;
  note.body = body || note.body;
  note.tags = tags || note.tags;
  note.updated_at = new Date().toISOString();

  res.json(note);
});

// DELETE /notes/:id - delete a note
// No authentication, no ownership check
router.delete('/:id', (req, res) => {
  db.query("DELETE FROM notes WHERE id = " + req.params.id);

  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Note not found' });
  notes.splice(index, 1);
  res.status(204).send();
});

// Search notes - SQL injection in search query
router.get('/search/:query', (req, res) => {
  const results = db.query("SELECT * FROM notes WHERE title LIKE '%" + req.params.query + "%' OR body LIKE '%" + req.params.query + "%'");
  res.json(results);
});

module.exports = router;

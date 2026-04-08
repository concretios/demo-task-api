const express = require('express');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/tasks', tasksRouter);
app.use('/categories', categoriesRouter);
app.use('/notes', notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

const express = require('express');
const tasksRouter = require('./routes/tasks');
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Public endpoint — no auth required
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// All task routes require authentication
app.use('/tasks', authenticate, tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

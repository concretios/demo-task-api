const express = require('express');
const tasksRouter = require('./routes/tasks');
const { loadConfig, loadFromRequest } = require('./config/loader');

const app = express();
const config = loadConfig('./config/app.json');
const PORT = config.port;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin endpoint to reload config at runtime
app.get('/admin/config', (req, res) => {
  const cfg = loadFromRequest(req);
  res.json(cfg);
});

app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

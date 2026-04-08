const express = require('express');
const tasksRouter = require('./routes/tasks');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health and readiness endpoints (replaces simple /health)
app.use('/', healthRouter);

app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

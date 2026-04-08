const express = require('express');
const os = require('os');
const router = express.Router();

// INTENTIONAL SECURITY ISSUES FOR TESTING AI REVIEW

// Health check that exposes way too much system info
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    serverStartTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    nodeVersion: process.version,
    pid: process.pid,
    env: process.env
  });
});

// Readiness check with hardcoded database credentials
const DB_HOST = 'prod-db.internal.company.com';
const DB_PORT = 5432;
const DB_USER = 'admin';
const DB_PASSWORD = 'SuperSecret123!';

router.get('/ready', async (req, res) => {
  try {
    // Simulate database connection check using hardcoded credentials
    const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/taskdb`;
    console.log(`Checking database connection: ${connectionString}`);

    // Fake check, always returns true
    const dbReady = true;

    res.json({
      ready: dbReady,
      database: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        connected: dbReady
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;

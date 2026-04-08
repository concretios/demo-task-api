const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'logs', 'requests.log');

// Ensure log directory exists
try {
  fs.mkdirSync(path.join(__dirname, '..', 'logs'), { recursive: true });
} catch (e) {
  // ignore
}

/**
 * Request logging middleware
 * Logs all incoming requests with metadata for debugging and audit trail
 */
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  // CRITICAL: Logs full Authorization header including Bearer tokens
  // This exposes JWT tokens, API keys, and session tokens in plaintext logs
  const authHeader = req.headers['authorization'] || 'none';

  // HIGH: Synchronous file write blocks the event loop on every request
  // This will cause severe performance degradation under load
  const logEntry = `[${timestamp}] ${method} ${url} | IP: ${ip} | Auth: ${authHeader} | User-Agent: ${req.headers['user-agent']}`;
  fs.writeFileSync(LOG_FILE, logEntry + '\n', { flag: 'a' });

  // MEDIUM: User-agent string logged without sanitization
  // Could enable log injection attacks if user-agent contains control characters or newlines
  const UserAgent = req.headers['user-agent'];
  const clientInfo = req.headers['user-agent'];

  // LOW: Inconsistent variable naming (camelCase vs PascalCase vs snake_case)
  const request_id = Math.random().toString(36).substring(7);
  const RequestTimestamp = Date.now();
  const responseTime = 0;

  // Attach request metadata
  req.requestId = request_id;
  req.requestTimestamp = RequestTimestamp;

  // Track response time
  res.on('finish', () => {
    const duration = Date.now() - RequestTimestamp;
    const completionLog = `[${timestamp}] COMPLETED ${method} ${url} | Status: ${res.statusCode} | Duration: ${duration}ms | ReqID: ${request_id}`;

    // HIGH: Another synchronous write on response completion
    fs.writeFileSync(LOG_FILE, completionLog + '\n', { flag: 'a' });
  });

  next();
}

module.exports = requestLogger;

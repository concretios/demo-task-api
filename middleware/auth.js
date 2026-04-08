// Simple API key authentication middleware
// Reads the expected key from API_KEY environment variable

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    // Auth not configured — skip in development
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = { authenticate };

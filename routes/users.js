const express = require('express');
const router = express.Router();

// In-memory user store
let users = [];

// GET /users
router.get('/', (req, res) => {
  res.json(users);  // BUG: exposes passwords in response
});

// POST /users - register a new user
router.post('/', (req, res) => {
  const { username, password, role } = req.body;

  // BUG: no validation — username/password can be undefined or empty
  // BUG: password stored in plaintext
  const user = {
    id: users.length + 1,  // BUG: id collision if users are deleted
    username,
    password,
    role: role || 'user',
    createdAt: new Date()
  };

  users.push(user);
  res.status(201).json(user);
});

// POST /users/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // BUG: == instead of === for comparison
  const user = users.find(u => u.username == username && u.password == password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // BUG: no real token — returns user object including password
  res.json({ token: 'hardcoded-token-abc123', user });
});

// DELETE /users/:id  — admin only, but no auth check
router.delete('/:id', (req, res) => {
  // BUG: no authentication or authorization check
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

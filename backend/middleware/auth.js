// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'village_election_secret_key_2026';

// Middleware ពិនិត្យ Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'សូម Login ជាមុនសិន' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token មិនត្រឹមត្រូវ ឬផុតកំណត់' });
  }
};

// Middleware ពិនិត្យសិទ្ធិ Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'អ្នកគ្មានសិទ្ធិធ្វើប្រតិបត្តិការនេះទេ' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
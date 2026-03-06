const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const SECRET = 'jobtrackr_secret_key';

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    );
    const token = jwt.sign({ id: result.rows[0].id }, SECRET, { expiresIn: '7d' });
    res.json({ token, email: result.rows[0].email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: result.rows[0].id }, SECRET, { expiresIn: '7d' });
    res.json({ token, email: result.rows[0].email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET all jobs for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE user_id=$1 ORDER BY date DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new job
router.post('/', auth, async (req, res) => {
  const { company, role, status, date, link, notes, salary } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO jobs (company, role, status, date, link, notes, salary, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [company, role, status, date, link, notes, salary || 0, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update job
router.put('/:id', auth, async (req, res) => {
  const { company, role, status, date, link, notes, salary } = req.body;
  try {
    const result = await pool.query(
      'UPDATE jobs SET company=$1, role=$2, status=$3, date=$4, link=$5, notes=$6, salary=$7 WHERE id=$8 AND user_id=$9 RETURNING *',
      [company, role, status, date, link, notes, salary || 0, req.params.id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE job
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM jobs WHERE id=$1 AND user_id=$2',
      [req.params.id, req.userId]
    );
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
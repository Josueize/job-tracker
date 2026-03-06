const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const pool = require('../db');
const auth = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/remind', auth, async (req, res) => {
  const { jobId, email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id=$1 AND user_id=$2', [jobId, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });

    const job = result.rows[0];

    await transporter.sendMail({
      from: `"JobTrackr" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Follow up: ${job.role} at ${job.company}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; padding: 32px; border-radius: 16px;">
          <h1 style="color: #4f6ef7; font-size: 24px;">JobTrackr Reminder 🔔</h1>
          <p style="color: #a0aec0;">Time to follow up on your application!</p>
          <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Role:</strong> ${job.role}</p>
            <p><strong>Status:</strong> ${job.status}</p>
            <p><strong>Applied:</strong> ${job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}</p>
          </div>
          <p style="color: #555570; font-size: 12px;">Sent by JobTrackr — Your career pipeline, organized.</p>
        </div>
      `,
    });

    res.json({ message: 'Reminder sent!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
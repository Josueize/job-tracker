const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const pool = require('./db');

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT NOW())`);
    await client.query(`CREATE TABLE IF NOT EXISTS jobs (id SERIAL PRIMARY KEY, company VARCHAR(100), role VARCHAR(100), status VARCHAR(50), date DATE, link TEXT, notes TEXT, user_id INTEGER REFERENCES users(id))`);
    console.log('Database tables ready!');
  } finally {
    client.release();
  }
}

const app = express();
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const remindersRouter = require('./routes/reminders');

app.use(cors({
  origin: [
    'https://jobtrackr-app-mu.vercel.app',
    'https://jobtrackr-app-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5001'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/api/jobs', jobsRouter);
app.use('/api/auth', authRouter);
app.use('/api/reminders', remindersRouter);

const PORT = process.env.PORT || 8080;

initDB().then(() => {
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
}).catch(err => {
  console.error('DB Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
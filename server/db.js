const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'jobtrackerfull',
      password: 'Godisgreatest',
      port: 5432,
    });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
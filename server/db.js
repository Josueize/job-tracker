const { Pool } = require('pg');

const isProduction = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway');

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'jobtrackerfull',
        password: 'Godisgreatest',
        port: 5432,
      }
);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
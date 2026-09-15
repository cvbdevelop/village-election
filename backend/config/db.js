const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: { rejectUnauthorized: false }, // ចាំបាច់សម្រាប់ Supabase
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL Connection Error:', err.message);
    return;
  }
  console.log('✅ Supabase PostgreSQL Connected Successfully!');
  release();
});

const query = async (text, params) => {
  let i = 1;
  const formattedText = text.replace(/\?/g, () => `$${i++}`);
  return pool.query(formattedText, params);
};

module.exports = { query, pool };
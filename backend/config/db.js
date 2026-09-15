const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL Connection Error:', err.message);
    return;
  }
  console.log('✅ Supabase PostgreSQL Connected Successfully!');
  release();
});

// បំលែង Query ពី `?` ទៅ `$1, $2` និងបង្វិលទម្រង់ឱ្យដូច MySQL
const query = async (text, params) => {
  let i = 1;
  const formattedText = text.replace(/\?/g, () => `$${i++}`);
  const result = await pool.query(formattedText, params);
  
  // ត្រឡប់ជា [rows, fields] ដើម្បីឱ្យកូដចាស់ដំណើរការបានធម្មតា
  return [result.rows, result.fields]; 
};

module.exports = { query, pool };
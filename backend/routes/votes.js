const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST បោះឆ្នោត
router.post('/', async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const { candidateId, voterId } = req.body;
    if (!candidateId || !voterId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'សូមជ្រើសរើសបេក្ខជន' });
    }

    const voters = await client.query(
      'SELECT voted FROM voters WHERE id = $1',
      [voterId]
    );

    if (voters.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'រកមិនឃើញអ្នកបោះឆ្នោត' });
    }

    if (voters.rows[0].voted) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'អ្នកបានបោះឆ្នោតរួចហើយ!' });
    }

    await client.query(
      'INSERT INTO votes (candidate_id, voter_id) VALUES ($1, $2)',
      [candidateId, voterId]
    );

    await client.query(
      'UPDATE voters SET voted = TRUE WHERE id = $1',
      [voterId]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'បោះឆ្នោតដោយជោគជ័យ' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  } finally {
    client.release();
  }
});

// GET លទ្ធផលបោះឆ្នោត
router.get('/results', async (req, res) => {
  try {
    // ប្រើ Destructuring យក rows ចេញពី Array
    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.party_role AS party,
        c.number,
        c.photo,
        COUNT(v.id)::int AS votes
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id, c.name, c.party_role, c.number, c.photo
      ORDER BY votes DESC
    `);

    const totalVotes = rows.reduce((sum, r) => sum + r.votes, 0);
    const results = rows.map((r) => ({
      ...r,
      percent: totalVotes > 0 ? ((r.votes / totalVotes) * 100).toFixed(2) : 0,
    }));

    res.json({ results, totalVotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
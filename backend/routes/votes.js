const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST បោះឆ្នោត
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { candidateId, voterId } = req.body;
    if (!candidateId || !voterId) {
      return res.status(400).json({ error: 'សូមជ្រើសរើសបេក្ខជន' });
    }

    const [voters] = await connection.query(
      'SELECT voted FROM voters WHERE id = ?',
      [voterId]
    );

    if (voters.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'រកមិនឃើញអ្នកបោះឆ្នោត' });
    }

    if (voters[0].voted) {
      await connection.rollback();
      return res.status(400).json({ error: 'អ្នកបានបោះឆ្នោតរួចហើយ!' });
    }

    await connection.query(
      'INSERT INTO votes (candidate_id, voter_id) VALUES (?, ?)',
      [candidateId, voterId]
    );

    await connection.query(
      'UPDATE voters SET voted = TRUE WHERE id = ?',
      [voterId]
    );

    await connection.commit();
    res.json({ success: true, message: 'បោះឆ្នោតដោយជោគជ័យ' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  } finally {
    connection.release();
  }
});

// GET លទ្ធផលបោះឆ្នោត
router.get('/results', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.number,
        c.name,
        c.party_role AS party,
        c.photo,
        COUNT(v.id) AS votes
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id
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
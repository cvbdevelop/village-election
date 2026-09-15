const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET អ្នកបោះឆ្នោតទាំងអស់
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM voters ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST ចុះឈ្មោះអ្នកបោះឆ្នោតថ្មី
router.post('/', async (req, res) => {
  try {
    const { name, idCard, commune, station } = req.body;
    if (!name || !idCard) {
      return res.status(400).json({ error: 'សូមបំពេញឈ្មោះ និងអត្តសញ្ញាណប័ណ្ណ' });
    }

    const [existing] = await db.query('SELECT * FROM voters WHERE id_card = ?', [idCard]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'អត្តសញ្ញាណប័ណ្ណនេះមានរួចហើយ!' });
    }

    const [rows] = await db.query(
      `INSERT INTO voters (name, id_card, commune, station) 
       VALUES (?, ?, ?, ?) RETURNING *`,
      [name, idCard, commune, station]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// PUT កែប្រែអ្នកបោះឆ្នោត
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, idCard, commune, station } = req.body;

    const [rows] = await db.query(
      `UPDATE voters SET name = ?, id_card = ?, commune = ?, station = ? 
       WHERE id = ? RETURNING *`,
      [name, idCard, commune, station, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE លុបអ្នកបោះឆ្នោត
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM voters WHERE id = ?', [id]);
    res.json({ message: 'លុបអ្នកបោះឆ្នោតដោយជោគជ័យ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST ផ្ទៀងផ្ទាត់អ្នកបោះឆ្នោត
router.post('/verify', async (req, res) => {
  try {
    const { idCard } = req.body;
    if (!idCard) {
      return res.status(400).json({ error: 'សូមបញ្ចូលអត្តសញ្ញាណប័ណ្ណ' });
    }

    const [voters] = await db.query(
      'SELECT * FROM voters WHERE id_card = ?',
      [idCard]
    );

    if (voters.length === 0) {
      return res.status(404).json({ error: 'រកមិនឃើញអត្តសញ្ញាណប័ណ្ណនេះទេ!' });
    }

    const voter = voters[0];
    if (voter.voted) {
      return res.status(400).json({ error: 'អ្នកបានបោះឆ្នោតរួចហើយ!' });
    }

    res.json({ success: true, voter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
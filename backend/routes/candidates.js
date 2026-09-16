// backend/routes/candidates.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET បេក្ខជនទាំងអស់
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM candidates ORDER BY number ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET បេក្ខជនតាម ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'រកមិនឃើញបេក្ខជន' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST បន្ថែមបេក្ខជនថ្មី
router.post('/', async (req, res) => {
  try {
    const {
      number, name, gender, dob, education,
      address, commune, party_role, gov_role, nec_id, photo,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'សូមបំពេញឈ្មោះបេក្ខជន' });
    }
    if (!commune) {
      return res.status(400).json({ error: 'សូមជ្រើសរើសឃុំ' });
    }

    const [rows] = await db.query(
      `INSERT INTO candidates 
        (number, name, gender, dob, education, address, commune, party_role, gov_role, nec_id, photo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`,
      [number, name, gender, dob || null, education, address, commune, party_role, gov_role, nec_id, photo]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
});

// PUT កែប្រែបេក្ខជន
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      number, name, gender, dob, education,
      address, commune, party_role, gov_role, nec_id, photo,
    } = req.body;

    const [rows] = await db.query(
      `UPDATE candidates SET 
        number = ?, name = ?, gender = ?, dob = ?, education = ?, 
        address = ?, commune = ?, party_role = ?, gov_role = ?, nec_id = ?, photo = ?
       WHERE id = ?
       RETURNING *`,
      [number, name, gender, dob || null, education, address, commune, party_role, gov_role, nec_id, photo, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'រកមិនឃើញបេក្ខជន' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE លុបបេក្ខជន
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM candidates WHERE id = ?', [id]);
    res.json({ message: 'លុបបេក្ខជនដោយជោគជ័យ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
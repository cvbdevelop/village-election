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

// POST បន្ថែមបេក្ខជនថ្មី
router.post('/', async (req, res) => {
  try {
    const {
      number,
      name,
      gender,
      dob,
      education,
      address,
      party_role,
      gov_role,
      nec_id,
      photo,
    } = req.body;

    // ============ Validation នៅ Backend ============
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ ២ តួអក្សរ' });
    }

    if (!gender) {
      return res.status(400).json({ error: 'សូមជ្រើសរើសភេទ' });
    }

    if (!nec_id || !/^\d{6,}$/.test(nec_id)) {
      return res.status(400).json({ error: 'អត្តលេខ គជប ត្រូវតែជាលេខយ៉ាងហោចណាស់ ៦ ខ្ទង់' });
    }

    // ពិនិត្យលេខរៀងស្ទួន
    if (number) {
      const [existingNumber] = await db.query(
        'SELECT id FROM candidates WHERE number = ?',
        [number]
      );
      if (existingNumber.length > 0) {
        return res.status(400).json({ error: 'លេខរៀងនេះមានរួចហើយ' });
      }
    }

    // ពិនិត្យអត្តលេខស្ទួន
    const [existingNecId] = await db.query(
      'SELECT id FROM candidates WHERE nec_id = ?',
      [nec_id]
    );
    if (existingNecId.length > 0) {
      return res.status(400).json({ error: 'អត្តលេខ គជប នេះមានរួចហើយ' });
    }

    // ពិនិត្យថ្ងៃខែឆ្នាំកំណើត
    if (dob) {
      const dobDate = new Date(dob);
      if (dobDate >= new Date()) {
        return res.status(400).json({ error: 'ថ្ងៃខែឆ្នាំកំណើតត្រូវតែជាកាលបរិច្ឆេទអតីតកាល' });
      }
    }

    // ============ បញ្ចូលទៅ Database ============
    const [result] = await db.query(
      `INSERT INTO candidates 
        (number, name, gender, dob, education, address, party_role, gov_role, nec_id, photo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [number, name, gender, dob, education, address, party_role, gov_role, nec_id, photo]
    );

    const [newCandidate] = await db.query(
      'SELECT * FROM candidates WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(newCandidate[0]);
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
      number,
      name,
      gender,
      dob,
      education,
      address,
      party_role,
      gov_role,
      nec_id,
      photo,
    } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ ២ តួអក្សរ' });
    }

    if (!nec_id || !/^\d{6,}$/.test(nec_id)) {
      return res.status(400).json({ error: 'អត្តលេខ គជប ត្រូវតែជាលេខយ៉ាងហោចណាស់ ៦ ខ្ទង់' });
    }

    // ពិនិត្យលេខរៀងស្ទួន (លើកលែង ID ខ្លួនឯង)
    const [existingNumber] = await db.query(
      'SELECT id FROM candidates WHERE number = ? AND id != ?',
      [number, id]
    );
    if (existingNumber.length > 0) {
      return res.status(400).json({ error: 'លេខរៀងនេះមានរួចហើយ' });
    }

    // ពិនិត្យអត្តលេខស្ទួន (លើកលែង ID ខ្លួនឯង)
    const [existingNecId] = await db.query(
      'SELECT id FROM candidates WHERE nec_id = ? AND id != ?',
      [nec_id, id]
    );
    if (existingNecId.length > 0) {
      return res.status(400).json({ error: 'អត្តលេខ គជប នេះមានរួចហើយ' });
    }

    await db.query(
      `UPDATE candidates SET 
        number = ?, name = ?, gender = ?, dob = ?, education = ?, 
        address = ?, party_role = ?, gov_role = ?, nec_id = ?, photo = ?
       WHERE id = ?`,
      [number, name, gender, dob, education, address, party_role, gov_role, nec_id, photo, id]
    );

    const [updated] = await db.query('SELECT * FROM candidates WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error: ' + error.message });
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
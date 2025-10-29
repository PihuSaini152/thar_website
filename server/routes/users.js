const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE user
router.post('/', (req, res) => {
  const { name, email, address, mobile } = req.body;
  console.log("Received body:", req.body);

  if (!name || !email || !address || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO userlist (name, email, address, mobile) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, address, mobile], (err, result) => {
    if (err) {
      console.error("INSERT ERROR:", err); // Show exact SQL error
      return res.status(500).json({ error: err.message });
    }

    console.log("Inserted:", result);
    res.status(201).json({ id: result.insertId, name, email, address, mobile });
  });
});

// READ all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM userlist', (err, result) => {
    if (err) {
      console.error("FETCH ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    res.send(result);
  });
});

// UPDATE user
router.put('/:id', (req, res) => {
  const { name, email, address, mobile } = req.body;
  db.query(
    'UPDATE userlist SET name = ?, email = ?, address = ?, mobile = ? WHERE id = ?',
    [name, email, address, mobile, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send({ id: req.params.id, name, email, address, mobile });
    }
  );
});

// DELETE user
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM userlist WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send({ id: req.params.id });
  });
});

module.exports = router;

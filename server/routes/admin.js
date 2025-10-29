const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all bookings for admin
router.get('/bookings', (req, res) => {
  const sql = 'SELECT * FROM bookings ORDER BY created_at DESC';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// UPDATE booking status (Approve/Reject)
router.put('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const { status, tracking_id, delivery_date, notes } = req.body;
  
  const sql = `
    UPDATE bookings 
    SET status = ?, tracking_id = ?, delivery_date = ?, notes = ?
    WHERE id = ?
  `;
  
  db.query(sql, [status, tracking_id, delivery_date, notes, bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`✅ Booking ${bookingId} updated to: ${status}`);
    res.json({ 
      message: `Booking ${status}`, 
      id: bookingId, 
      status: status,
      tracking_id: tracking_id
    });
  });
});

// DELETE booking
router.delete('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  
  const sql = 'DELETE FROM bookings WHERE id = ?';
  
  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`✅ Booking ${bookingId} deleted`);
    res.json({ message: 'Booking deleted successfully', id: bookingId });
  });
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Bookings storage file
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

// Initialize bookings file if not exists
const initializeBookingsFile = () => {
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
  }
};

// Read bookings from file
const readBookings = () => {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write bookings to file
const writeBookings = (bookings) => {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
};

// Initialize on server start
initializeBookingsFile();

// ✅ CREATE BOOKING API
app.post('/api/booking/create', (req, res) => {
  try {
    const { name, email, phone, city, date, variant, test_drive } = req.body;

    // Generate unique booking ID
    const bookingId = 'THAR' + Date.now();

    // Create new booking
    const newBooking = {
      bookingId: bookingId,
      customerName: name,
      email: email,
      phone: phone,
      city: city,
      preferredDate: date,
      vehicleModel: `Thar ${variant}`,
      testDrive: test_drive,
      status: 'Pending',
      bookingDate: new Date().toISOString()
    };

    // Save to file
    const bookings = readBookings();
    bookings.push(newBooking);
    writeBookings(bookings);

    console.log('✅ New booking created:', bookingId);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: bookingId,
      booking: newBooking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ✅ CHECK BOOKING API
app.post('/api/booking/check', (req, res) => {
  try {
    const { bookingId, email, phone } = req.body;
    const bookings = readBookings();
    
    let booking = null;
    
    if (bookingId) {
      booking = bookings.find(b => b.bookingId.toUpperCase() === bookingId.toUpperCase());
    } else if (email) {
      booking = bookings.find(b => b.email.toLowerCase() === email.toLowerCase());
    } else if (phone) {
      booking = bookings.find(b => b.phone === phone);
    }
    
    if (booking) {
      res.json({
        success: true,
        booking: booking
      });
    } else {
      res.json({
        success: false,
        message: 'Booking not found'
      });
    }
  } catch (error) {
    console.error('Error checking booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ✅ GET ALL BOOKINGS (Testing के लिए)
app.get('/api/booking/all', (req, res) => {
  try {
    const bookings = readBookings();
    res.json({
      success: true,
      bookings: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ✅ ADMIN: GET ALL BOOKINGS (Admin panel के लिए)
app.get('/api/admin/bookings', (req, res) => {
  try {
    const bookings = readBookings();
    res.json({  
      success: true,
      bookings: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ✅ ADMIN: UPDATE BOOKING STATUS
app.put('/api/admin/update-status/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const bookings = readBookings();
    const bookingIndex = bookings.findIndex(b => b.bookingId === bookingId);

    if (bookingIndex !== -1) {
      // Update status
      bookings[bookingIndex].status = status;
      
      // Add status update timestamp
      bookings[bookingIndex].lastUpdated = new Date().toISOString();
      
      writeBookings(bookings);
      
      console.log(`✅ Status updated: ${bookingId} -> ${status}`);
      
      res.json({
        success: true,
        message: 'Status updated successfully',
        booking: bookings[bookingIndex]
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ✅ ADMIN: DELETE BOOKING
app.delete('/api/admin/delete-booking/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookings = readBookings();
    const filteredBookings = bookings.filter(b => b.bookingId !== bookingId);

    if (filteredBookings.length < bookings.length) {
      writeBookings(filteredBookings);
      console.log(`✅ Booking deleted: ${bookingId}`);
      
      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚗 Thar Booking API is running!',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`💾 Using JSON file storage: bookings.json`);
  console.log(`👑 Admin APIs available at /api/admin/`);
});
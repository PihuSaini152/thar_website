const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Storage files
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
const TEST_DRIVES_FILE = path.join(__dirname, 'test-drives.json');

// Initialize files if not exist
const initializeFiles = () => {
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(TEST_DRIVES_FILE)) {
    fs.writeFileSync(TEST_DRIVES_FILE, JSON.stringify([]));
  }
};

// Read/Write helpers
const readBookings = () => {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeBookings = (bookings) => {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
};

const readTestDrives = () => {
  try {
    const data = fs.readFileSync(TEST_DRIVES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeTestDrives = (testDrives) => {
  fs.writeFileSync(TEST_DRIVES_FILE, JSON.stringify(testDrives, null, 2));
};

// Initialize on server start
initializeFiles();

// ✅ BOOK TEST DRIVE API (Frontend से match करता है)
app.post('/api/book-test-drive', (req, res) => {
  try {
    const { name, email, phone, variant, date } = req.body;

    // Validation
    if (!name || !email || !phone || !variant || !date) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10 digits'
      });
    }

    // Check if date is in future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Please select a future date'
      });
    }

    // Generate unique booking ID
    const bookingId = 'TD-' + Date.now();

    // Create test drive booking
    const newTestDrive = {
      bookingId: bookingId,
      customerName: name,
      email: email,
      phone: phone,
      variant: variant,
      preferredDate: date,
      status: 'Pending',
      bookingDate: new Date().toISOString(),
      notes: ''
    };

    // Save to file
    const testDrives = readTestDrives();
    testDrives.push(newTestDrive);
    writeTestDrives(testDrives);

    console.log('✅ Test Drive Booked:', bookingId, '-', name);

    res.status(201).json({
      success: true,
      message: 'Test drive booked successfully! We will contact you soon.',
      bookingId: bookingId,
      booking: newTestDrive
    });

  } catch (error) {
    console.error('❌ Test drive booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// ✅ CHECK TEST DRIVE STATUS
app.post('/api/test-drive/check', (req, res) => {
  try {
    const { bookingId, email, phone } = req.body;
    const testDrives = readTestDrives();
    
    let testDrive = null;
    
    if (bookingId) {
      testDrive = testDrives.find(td => td.bookingId.toUpperCase() === bookingId.toUpperCase());
    } else if (email) {
      testDrive = testDrives.find(td => td.email.toLowerCase() === email.toLowerCase());
    } else if (phone) {
      testDrive = testDrives.find(td => td.phone === phone);
    }
    
    if (testDrive) {
      res.json({
        success: true,
        testDrive: testDrive
      });
    } else {
      res.json({
        success: false,
        message: 'Test drive booking not found'
      });
    }
  } catch (error) {
    console.error('Error checking test drive:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ✅ ADMIN: GET ALL TEST DRIVES
app.get('/api/admin/test-drives', (req, res) => {
  try {
    const testDrives = readTestDrives();
    
    // Sort by date (newest first)
    const sortedTestDrives = testDrives.sort((a, b) => 
      new Date(b.bookingDate) - new Date(a.bookingDate)
    );
    
    res.json({
      success: true,
      total: testDrives.length,
      testDrives: sortedTestDrives
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ✅ ADMIN: UPDATE TEST DRIVE STATUS
app.put('/api/admin/test-drive/update-status/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const testDrives = readTestDrives();
    const testDriveIndex = testDrives.findIndex(td => td.bookingId === bookingId);

    if (testDriveIndex !== -1) {
      testDrives[testDriveIndex].status = status;
      if (notes) {
        testDrives[testDriveIndex].notes = notes;
      }
      testDrives[testDriveIndex].lastUpdated = new Date().toISOString();
      
      writeTestDrives(testDrives);
      
      console.log(`✅ Test Drive Status Updated: ${bookingId} -> ${status}`);
      
      res.json({
        success: true,
        message: 'Status updated successfully',
        testDrive: testDrives[testDriveIndex]
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Test drive booking not found'
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

// ✅ ADMIN: DELETE TEST DRIVE
app.delete('/api/admin/test-drive/delete/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;

    const testDrives = readTestDrives();
    const filteredTestDrives = testDrives.filter(td => td.bookingId !== bookingId);

    if (filteredTestDrives.length < testDrives.length) {
      writeTestDrives(filteredTestDrives);
      console.log(`✅ Test Drive Deleted: ${bookingId}`);
      
      res.json({
        success: true,
        message: 'Test drive booking deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Test drive booking not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ✅ GET STATISTICS
app.get('/api/admin/statistics', (req, res) => {
  try {
    const bookings = readBookings();
    const testDrives = readTestDrives();
    
    const stats = {
      totalBookings: bookings.length,
      totalTestDrives: testDrives.length,
      pendingTestDrives: testDrives.filter(td => td.status === 'Pending').length,
      confirmedTestDrives: testDrives.filter(td => td.status === 'Confirmed').length,
      completedTestDrives: testDrives.filter(td => td.status === 'Completed').length
    };
    
    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ========== EXISTING BOOKING APIs ==========

// ✅ CREATE BOOKING API
app.post('/api/booking/create', (req, res) => {
  try {
    const { name, email, phone, city, date, variant, test_drive } = req.body;

    const bookingId = 'THAR' + Date.now();

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

// ✅ GET ALL BOOKINGS
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

// ✅ ADMIN: GET ALL BOOKINGS
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
      bookings[bookingIndex].status = status;
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
    endpoints: {
      testDrive: '/api/book-test-drive',
      checkTestDrive: '/api/test-drive/check',
      adminTestDrives: '/api/admin/test-drives',
      statistics: '/api/admin/statistics'
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`💾 Using JSON file storage`);
  console.log(`📋 Test Drives: test-drives.json`);
  console.log(`🚗 Bookings: bookings.json`);
  console.log(`👑 Admin APIs available at /api/admin/`);
});
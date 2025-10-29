const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send confirmation email
const sendConfirmationEmail = async (booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `🚗 Your Thar Booking Confirmation - ${booking.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b00;">🎉 Your Thar Booking is Confirmed!</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Name:</strong> ${booking.customerName}</p>
            <p><strong>Vehicle:</strong> ${booking.vehicleModel}</p>
            <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>

          <div style="margin-top: 20px;">
            <h3>Track Your Order:</h3>
            <a href="http://localhost:3000/booking-status" 
               style="background: #ff6b00; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>

          <p style="margin-top: 20px;">
            <strong>Need Help?</strong><br>
            Email: support@mahindra.com<br>
            Phone: 1800-209-6006
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', booking.email);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// ✅ REAL BOOKING API - Create new booking
router.post('/create', async (req, res) => {
  try {
    const { name, email, phone, city, date, variant, test_drive } = req.body;

    // Generate unique booking ID
    const bookingId = 'THAR' + Date.now();

    // Create new booking
    const newBooking = new Booking({
      bookingId: bookingId,
      customerName: name,
      email: email,
      phone: phone,
      city: city,
      preferredDate: date,
      vehicleModel: `Thar ${variant}`,
      testDrive: test_drive,
      status: 'Pending',
      bookingDate: new Date()
    });

    // Save to database
    await newBooking.save();

    // Send confirmation email
    const emailSent = await sendConfirmationEmail(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: bookingId,
      emailSent: emailSent,
      booking: {
        id: newBooking._id,
        bookingId: newBooking.bookingId,
        customerName: newBooking.customerName,
        email: newBooking.email,
        vehicle: newBooking.vehicleModel,
        status: newBooking.status,
        bookingDate: newBooking.bookingDate
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ✅ CHECK BOOKING API - Database se search karega
router.post('/check', async (req, res) => {
  const { bookingId, email, phone } = req.body;
  
  try {
    let booking;
    
    if (bookingId) {
      booking = await Booking.findOne({ bookingId: bookingId.toUpperCase() });
    } else if (email) {
      booking = await Booking.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      booking = await Booking.findOne({ phone: phone });
    }
    
    if (booking) {
      res.json({
        success: true,
        booking: {
          bookingId: booking.bookingId,
          vehicle: booking.vehicleModel,
          status: booking.status,
          bookingDate: booking.bookingDate,
          customerName: booking.customerName,
          city: booking.city,
          email: booking.email,
          phone: booking.phone,
          testDrive: booking.testDrive
        }
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

// ✅ GET ALL BOOKINGS (Admin ke liye)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
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

// ✅ UPDATE BOOKING STATUS (Admin ke liye)
router.put('/update-status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findOneAndUpdate(
      { bookingId: bookingId },
      { status: status },
      { new: true }
    );

    if (booking) {
      res.json({
        success: true,
        message: 'Status updated successfully',
        booking: booking
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

module.exports = router;
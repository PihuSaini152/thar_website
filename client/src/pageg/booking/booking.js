import React, { useState } from 'react';
import './booking.css';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    date: '',
    variant: 'LX',
    test_drive: false
  });

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setBookingDetails(result.booking);
        setBookingSuccess(true);
        
        // Reset form
        setFormData({ 
          name: '', email: '', phone: '', city: '', 
          date: '', variant: 'LX', test_drive: false 
        });
      } else {
        alert('❌ Booking failed: ' + (result.error || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Booking failed! Please make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess && bookingDetails) {
    return (
      <div className="booking-container">
        <div className="success-message">
          <div className="success-icon">🎉</div>
          <h1>Booking Successful!</h1>
          
          <div className="booking-details-card">
            <h3>Booking Confirmed</h3>
            <div className="detail-item">
              <label>Booking ID:</label>
              <span className="booking-id">{bookingDetails.bookingId}</span>
            </div>
            <div className="detail-item">
              <label>Name:</label>
              <span>{bookingDetails.customerName}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{bookingDetails.email}</span>
            </div>
            <div className="detail-item">
              <label>Vehicle:</label>
              <span>{bookingDetails.vehicleModel}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className="status-pending">{bookingDetails.status}</span>
            </div>
          </div>
          
          <div className="next-steps">
            <h3>📋 What's Next?</h3>
            <ul>
              <li>✅ Your booking is confirmed</li>
              <li>📞 Our executive will contact you soon</li>
              <li>🚗 Track your order status anytime</li>
              <li>📝 Save your Booking ID: <strong>{bookingDetails.bookingId}</strong></li>
            </ul>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => window.location.href = '/booking-status'}
              className="track-btn"
            >
              🚗 Track My Order
            </button>
            <button 
              onClick={() => setBookingSuccess(false)}
              className="book-again-btn"
            >
              📝 Book Another Thar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      {/* Your existing booking form remains same */}
      <div className="booking-header">
        <h1>Book Your THAR</h1>
        <p>Start your adventure with the legendary Thar</p>
      </div>

      <div className="booking-content">
        <div className="features-list">
          <h3>THAR Features:</h3>
          <ul>
            <li>✓ 7-inch Infotainment</li>
            <li>✓ Dual Airbags</li>
            <li>✓ Alloy Wheels</li>
            <li>✓ LED DRLs</li>
            <li>✓ Off-road Capability</li>
            <li>✓ Fog Lamps</li>
            <li>✓ Music System</li>
          </ul>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <h3>Booking Form</h3>
          
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Variant:</label>
            <select name="variant" value={formData.variant} onChange={handleChange}>
              <option value="LX">LX</option>
              <option value="AX">AX</option>
              <option value="AX Opt">AX Opt</option>
            </select>
          </div>

          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
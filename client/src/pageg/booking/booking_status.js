import React, { useState } from 'react';
import './booking_status.css';

const BookingStatus = () => {
  const [searchType, setSearchType] = useState('bookingId');
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundBooking, setFoundBooking] = useState(null);
  const [showTracking, setShowTracking] = useState(false);

  // Progress steps
  const steps = [
    { id: 1, name: 'Pending', description: 'Booking Received' },
    { id: 2, name: 'Confirmed', description: 'Booking Confirmed' },
    { id: 3, name: 'Shipped', description: 'Vehicle Dispatched' },
    { id: 4, name: 'Delivered', description: 'Vehicle Delivered' },
    { id: 5, name: 'Under Review', description: 'Quality Check' }
  ];

  // ✅ REAL API CALL - Database se data lega
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setLoading(true);

    let searchData = {};
    if (searchType === 'bookingId') {
      searchData = { bookingId: bookingId.trim() };
    } else if (searchType === 'email') {
      searchData = { email: email.trim() };
    } else if (searchType === 'phone') {
      searchData = { phone: phone.trim() };
    }

    try {
      const response = await fetch('https://thar-website.onrender.com/api/booking/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setFoundBooking(result.booking);
        setShowTracking(true);
      } else {
        alert('❌ ' + (result.message || 'Booking not found!'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Server error! Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setFoundBooking(null);
    setShowTracking(false);
    setBookingId('');
    setEmail('');
    setPhone('');
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.name === foundBooking?.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  // Auto-fill demo data
  const fillDemoData = () => {
    if (searchType === 'bookingId') {
      setBookingId('THAR1761667594602');
    } else if (searchType === 'email') {
      setEmail('demo@example.com');
    } else if (searchType === 'phone') {
      setPhone('9876543210');
    }
  };

  if (showTracking && foundBooking) {
    return (
      <div className="booking-status-container">
        {/* Tracking Header */}
        <div className="tracking-header">
          <button onClick={resetSearch} className="back-btn">
            ← Search Again
          </button>
          <h1>🚗 Order Tracking</h1>
          <p>Real-time updates for your Thar booking</p>
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h2>📋 Booking Details</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <label>Booking ID:</label>
              <span className="booking-id">{foundBooking.bookingId}</span>
            </div>
            <div className="summary-item">
              <label>Customer:</label>
              <span>{foundBooking.customerName}</span>
            </div>
            <div className="summary-item">
              <label>Vehicle:</label>
              <span className="vehicle">{foundBooking.vehicle}</span>
            </div>
            <div className="summary-item">
              <label>Booking Date:</label>
              <span>{new Date(foundBooking.bookingDate).toLocaleDateString()}</span>
            </div>
            <div className="summary-item">
              <label>City:</label>
              <span>{foundBooking.city}</span>
            </div>
            <div className="summary-item">
              <label>Current Status:</label>
              <span className={`status-badge status-${foundBooking.status.toLowerCase()}`}>
                {foundBooking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="progress-tracking">
          <h2>📦 Order Progress</h2>
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`progress-step ${index <= currentStepIndex ? 'completed' : ''} ${index === currentStepIndex ? 'current' : ''}`}
              >
                <div className="step-number">
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <div className="step-info">
                  <h4>{step.name}</h4>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status Details */}
        <div className="status-details">
          <h3>📊 Current Status Details</h3>
          <div className="status-info">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Contact Email:</strong> {foundBooking.email}</p>
            <p><strong>Contact Phone:</strong> {foundBooking.phone}</p>
            {foundBooking.status === 'Delivered' && foundBooking.deliveryDate && (
              <p><strong>Delivered On:</strong> {foundBooking.deliveryDate}</p>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h3>📞 Need Help?</h3>
          <p>Contact our customer support for any queries</p>
          <div className="support-options">
            <button className="support-btn">📧 Email Support</button>
            <button className="support-btn">📱 Call: 1800-THAR</button>
            <button className="support-btn">💬 WhatsApp</button>
          </div>
        
        </div>
      </div>
    );
  }

  // Search Form (Initial State)
  return (
    <div className="booking-status-container">
      <div className="status-header">
        <h1>Track Your Thar Order</h1>
        <p>Find your booking using any of these methods</p>
        
        <div className="demo-info">
          <strong>💡 REAL MODE:</strong> Connected to backend database
          <button onClick={fillDemoData} className="demo-fill-btn">
            Fill Test Data
          </button>
        </div>
      </div>

      {/* Search Type Tabs */}
      <div className="search-tabs">
        <button 
          className={`tab-btn ${searchType === 'bookingId' ? 'active' : ''}`}
          onClick={() => setSearchType('bookingId')}
        >
          📋 Booking ID
        </button>
        <button 
          className={`tab-btn ${searchType === 'email' ? 'active' : ''}`}
          onClick={() => setSearchType('email')}
        >
          📧 Email
        </button>
        <button 
          className={`tab-btn ${searchType === 'phone' ? 'active' : ''}`}
          onClick={() => setSearchType('phone')}
        >
          📱 Phone
        </button>
      </div>

      <form onSubmit={handleCheckStatus} className="booking-form">
        {searchType === 'bookingId' && (
          <div className="input-group">
            <label htmlFor="bookingId">📋 Booking ID</label>
            <input
              type="text"
              id="bookingId"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value.toUpperCase())}
              placeholder="THAR1761667594602"
              required
            />
            <small>Enter your actual Booking ID</small>
          </div>
        )}

        {searchType === 'email' && (
          <div className="input-group">
            <label htmlFor="email">📧 Registered Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            <small>Enter your registered email</small>
          </div>
        )}

        {searchType === 'phone' && (
          <div className="input-group">
            <label htmlFor="phone">📱 Registered Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
            />
            <small>Enter your registered phone number</small>
          </div>
        )}

        <button type="submit" className="check-status-btn" disabled={loading}>
          {loading ? '🔍 Searching...' : '🚗 Track Order'}
        </button>
      </form>

      {/* Information Section */}
      <div className="demo-section">
        <h3>🎯 How to Use?</h3>
        <div className="demo-cards">
          <div className="demo-card">
            <h4>1. Book First</h4>
            <p>Go to Booking page and create a booking</p>
          </div>
          <div className="demo-card">
            <h4>2. Get Booking ID</h4>
            <p>Check your email for Booking ID</p>
          </div>
          <div className="demo-card">
            <h4>3. Track Here</h4>
            <p>Use Booking ID, Email or Phone to track</p>
          </div>
        </div>
        
        
      
      </div>
    </div>
  );
};

export default BookingStatus;
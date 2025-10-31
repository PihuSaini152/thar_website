import React, { useState, useEffect } from 'react';
import './adminpannel.css';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Simple password - आप ये change कर सकते हैं
  const ADMIN_PASSWORD = '@Pihu001';

  // Login function
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('❌ Invalid password!');
      setPassword('');
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://thar-website-blmg.vercel.app/api/admin/bookings');
      const result = await response.json();
      if (result.success) {
        setBookings(result.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('❌ Error loading bookings. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`https://thar-website-blmg.vercel.app/api/admin/update-status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Status updated to: ${newStatus}`);
        fetchBookings(); // Refresh list
      } else {
        alert('❌ Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // 🔐 LOGIN PAGE - सिर्फ password दिखेगा
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-box">
          <h1>🔐 Admin Login</h1>
          <p>Enter password to access admin panel</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              🔑 Login
            </button>
          </form>

          <div className="login-note">
            <small>Only authorized personnel can access this panel</small>
          </div>
        </div>
      </div>
    );
  }

  // 👑 ADMIN PANEL - सिर्फ login के बाद दिखेगा
  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-top-bar">
          <h1>👑 Admin Panel</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="logout-btn"
          >
            🚪 Logout
          </button>
        </div>
        <p>Manage Thar Bookings & Update Status</p>
        <button onClick={fetchBookings} className="refresh-btn">
          🔄 Refresh Bookings
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : (
        <div className="bookings-list">
          <h2>📋 All Bookings ({bookings.length})</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found</p>
              <p>Create a booking first from the Booking page</p>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.bookingId} className="booking-card">
                <div className="booking-info">
                  <h3>📝 {booking.bookingId}</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Customer:</strong> {booking.customerName}
                    </div>
                    <div className="info-item">
                      <strong>Email:</strong> {booking.email}
                    </div>
                    <div className="info-item">
                      <strong>Phone:</strong> {booking.phone}
                    </div>
                    <div className="info-item">
                      <strong>Vehicle:</strong> {booking.vehicleModel}
                    </div>
                    <div className="info-item">
                      <strong>City:</strong> {booking.city}
                    </div>
                    <div className="info-item">
                      <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="status-section">
                    <strong>Current Status:</strong>
                    <span className={`status-badge status-${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
 
                <div className="action-buttons">
                  <h4>🔄 Update Status:</h4>
                  <div className="status-buttons">
                    <button 
                      onClick={() => updateStatus(booking.bookingId, 'Confirmed')}
                      className="status-btn confirmed"
                      disabled={booking.status === 'Confirmed'}
                    >
                      ✅ Confirm Order
                    </button>
                    <button 
                      onClick={() => updateStatus(booking.bookingId, 'Shipped')}
                      className="status-btn shipped"
                      disabled={booking.status === 'Shipped'}
                    >
                      🚚 Mark Shipped
                    </button>
                    <button 
                      onClick={() => updateStatus(booking.bookingId, 'Delivered')}
                      className="status-btn delivered"
                      disabled={booking.status === 'Delivered'}
                    >
                      📦 Mark Delivered
                    </button>
                    <button 
                      onClick={() => updateStatus(booking.bookingId, 'Under Review')}
                      className="status-btn under-review"
                      disabled={booking.status === 'Under Review'}
                    >
                      🔍 Under Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
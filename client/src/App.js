import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/navbar/navbar.js"; 
import Home from "./pageg/home/home.js";
import Footer from "./components/footer/footer.js";
import Booking from "./pageg/booking/booking.js";
import BookingStatus from "./pageg/booking/booking_status.js";
import AdminPanel from "./pageg/adminpannel.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
        <Route path="/adminpannel" element={<AdminPanel />} />  
          <Route path="/booking-status" element={<BookingStatus />} /> {/* ✅ CHANGE PATH */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import './home.css';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    variant: '',
    date: ''
  });

  // Real Thar Variants Data
  const variants = [
    {
      name: "THAR AX OPT",
      price: "₹15.60 Lakh*",
      image: "/home/thar1.jpg",
      features: ["4x4 Drive", "7-inch Infotainment", "Dual Airbags", "Alloy Wheels", "LED DRLs"]
    },
    {
      name: "THAR LX",
      price: "₹13.25 Lakh*",
      image: "/home/thar2.jpg",
      features: ["4x2 Drive", "Touchscreen", "Power Windows", "AC", "Central Locking"]
    },
    {
      name: "THAR AX",
      price: "₹14.85 Lakh*",
      image: "/home/thar3.jpg",
      features: ["4x4 Drive", "Off-road Capability", "Alloy Wheels", "Fog Lamps", "Music System"]
    },
    {
  name: "THAR LX HARD TOP",
  price: "₹16.20 Lakh*",
  image: "/home/thar4.jpg",
  features: [
    "4x4 Diesel Engine",
    "8-inch Touch Infotainment",
    "Cruise Control",
    "Rear Parking Camera",
    "Adventure Mode"
  ]
}
  ];

  // Features Data
  const features = [
    {
      icon: "🚙",
      title: "4x4 DRIVE",
      description: "Advanced 4WD System with Low Range Transfer Case"
    },
    {
      icon: "⚡",
      title: "POWERFUL ENGINE",
      description: "2.0L mStallion Turbo Petrol & 2.2L mHawk Diesel"
    },
    {
      icon: "🌧️",
      title: "WATER WADING",
      description: "650mm Water Wading Capacity"
    },
    {
      icon: "📱",
      title: "INFOTAINMENT",
      description: "26.03 cm HD Touchscreen with Navigation"
    },
    {
      icon: "🛋️",
      title: "COMFORT",
      description: "Rear AC Vents with Armrest"
    },
    {
      icon: "🔒",
      title: "SAFETY",
      description: "Dual Airbags & ABS with EBD"
    }
  ];

  // Real Thar Gallery Images
  const galleryImages = [
    "/home/card1.jpg",
    "/home/card2.jpg",
    "/home/card3.jpg",
    "/home/card4.jpg",
    "/home/card5.jpg",
    "/home/card6.jpg",
    
  ];

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle Test Drive Booking
  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://thar-website.onrender.com/api/book-test-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Test Drive Booked Successfully! We will contact you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          variant: '',
          date: ''
        });
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection.');
    }
  };

  // Handle Brochure Download
  const handleBrochureDownload = () => {
    // Simulate brochure download
    alert('Brochure download started!');
    // You can replace this with actual file download
    window.open('#', '_blank');
  };

  // Handle Book Now
  const handleBookNow = (variantName) => {
    alert(`Booking process started for ${variantName}`);
    // Redirect to booking page or open modal
  };

  return (
    <div className="home-page">
   {/* ===== HERO SECTION ===== */}
<section className="hero-section" id="home">
  <div className="hero-background">
    <div className="bg-overlay"></div>
    <div className="hero-content">
      <div className="hero-text">
        <h1 className="main-title">
          THE <span className="highlight">LEGENDARY</span> THAR
        </h1>
        <p className="subtitle">Built to Conquer Any Terrain</p>
        <div className="hero-buttons">
          <button 
            className="hero-btn primary-btn"
            onClick={() => document.getElementById('test-drive').scrollIntoView({ behavior: 'smooth' })}
          >
            🚙 BOOK TEST DRIVE
          </button>
          <button 
            className="hero-btn secondary-btn"
            onClick={handleBrochureDownload}
          >
            📄 DOWNLOAD BROCHURE
          </button>
        </div>
      </div>
      <div className="hero-image">
   <img 
  src="/home/thar.jpg" 
  alt="Mahindra Thar" 
  className="thar-hero-image"
/>
      </div>
    </div>
  </div>
</section>
      {/* ===== VARIANTS SECTION ===== */}
      <section className="variants-section" id="variants">
        <div className="container">
          <h2 className="section-title">CHOOSE YOUR <span className="highlight">ADVENTURE</span></h2>
          <p className="section-subtitle">Select from our premium variants</p>
          
          <div className="variants-grid">
            {variants.map((variant, index) => (
              <div key={index} className="variant-card">
                <div className="variant-image">
                  <img src={variant.image} alt={variant.name} />
                  <div className="variant-overlay">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleBookNow(variant.name)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="variant-info">
                  <h3 className="variant-name">{variant.name}</h3>
                  <p className="variant-price">{variant.price}</p>
                  <ul className="variant-features">
                    {variant.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                  <button 
                    className="variant-book-btn"
                    onClick={() => handleBookNow(variant.name)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title">UNMATCHED <span className="highlight">FEATURES</span></h2>
          <p className="section-subtitle">Engineered for Ultimate Performance</p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section className="gallery-section" id="gallery">
        <div className="container">
          <h2 className="section-title">GALLERY</h2>
          <p className="section-subtitle">Explore the Thar in Every Angle</p>
          
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`Thar ${index + 1}`} />
                <div className="gallery-overlay">
                  <button 
                    className="zoom-btn"
                    onClick={() => window.open(image, '_blank')}
                  >
                    🔍
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEST DRIVE SECTION ===== */}
      <section className="testdrive-section" id="test-drive">
        <div className="container">
          <div className="testdrive-content">
            <div className="testdrive-text">
              <h2 className="section-title">READY FOR <span className="highlight">ADVENTURE?</span></h2>
              <p className="section-subtitle">Book your test drive today and experience the legend</p>
              <div className="testdrive-features">
                <div className="feature-item">✅ Free Test Drive at Your Doorstep</div>
                <div className="feature-item">✅ No Commitment Required</div>
                <div className="feature-item">✅ Expert Consultation</div>
                <div className="feature-item">✅ Special Offers Available</div>
              </div>
            </div>
            
            <div className="testdrive-form">
              <h3>BOOK TEST DRIVE</h3>
              <form className="booking-form" onSubmit={handleTestDriveSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Full Name" 
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Phone Number" 
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <select 
                    name="variant"
                    className="form-input"
                    value={formData.variant}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Preferred Variant</option>
                    <option value="THAR AX OPT">THAR AX OPT</option>
                    <option value="THAR LX">THAR LX</option>
                    <option value="THAR AX">THAR AX</option>
                  </select>
                </div>
                <div className="form-group">
                  <input 
                    type="date" 
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  SCHEDULE TEST DRIVE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
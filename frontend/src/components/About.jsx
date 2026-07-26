export default function About() {
  return (
    <section id="page-about">
      <div className="about-layout">
        <div className="about-story">
          <h2 className="about-title">Our Story</h2>
          <p className="about-desc">
            HotZone has been serving Udangudi's finest fast food & grill since 2020.
            Every dish is crafted with fire, soul, and real flavour — using the freshest
            halal ingredients, cooked fresh to order every evening.
          </p>
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-num">5+</div>
              <div className="about-stat-label">Years of service</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">40+</div>
              <div className="about-stat-label">Menu items</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">100%</div>
              <div className="about-stat-label">Fresh daily</div>
            </div>
          </div>

          <div className="about-contact">
            <a className="about-contact-btn" href="https://wa.me/919597490304" target="_blank" rel="noreferrer">
              📲 Order on WhatsApp
            </a>
            <div className="about-contact-info">
              <span>📍 Udangudi, Tamil Nadu</span>
              <span>⏰ Open 4PM – 10PM</span>
            </div>
          </div>
        </div>

        <div className="about-photo-wrap">
          <img src="/img/HZ.jpeg" alt="HotZone cafe" className="about-photo" />
          <div className="about-photo-badge">
            <a
              style={{ color: '#fff', textDecoration: 'none' }}
              href="https://www.google.com/maps/place/HotZone/@8.4307948,78.0275855,17z"
              target="_blank"
              rel="noreferrer"
            >
              📍 Visit Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

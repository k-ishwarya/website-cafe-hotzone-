const CATS = ['All', 'Sandwich', 'Burger', 'Pizza', 'Fries', 'Mojito', 'Milkshake', 'Meat']

export default function Menu({ menuItems, activeCategory, filterCat }) {
  const items =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory)

  return (
    <section id="page-menu">
      <div className="menu-banner">
        <div className="menu-banner-inner">
          <div className="menu-banner-left">
            <div className="menu-banner-tag">🔥 Fresh Grilled · Halal Certified</div>
            <h2 className="menu-banner-heading">Our Full <span>Menu</span></h2>
            <p className="menu-banner-sub">
              Every item made to order. Pick your favourite and order directly on WhatsApp — we'll have it ready.
            </p>
            <div className="menu-banner-actions">
              <a className="btn btn-primary menu-wa-btn" href="https://wa.me/919597490304" target="_blank" rel="noreferrer">
                📲 Order on WhatsApp
              </a>
              <div className="menu-banner-meta">
                <span>📍 Udangudi, TN</span>
                <span>⏰ 4PM – 10PM</span>
                <span>📞 +91 95974 90304</span>
              </div>
            </div>
          </div>

          <div className="menu-banner-right">
            <div className="menu-stat-pill"><span className="menu-stat-num">40+</span><span className="menu-stat-label">Items</span></div>
            <div className="menu-stat-pill"><span className="menu-stat-num">✅</span><span className="menu-stat-label">100% Halal</span></div>
            <div className="menu-stat-pill"><span className="menu-stat-num">🔥</span><span className="menu-stat-label">Cooked Fresh</span></div>
            <div className="menu-stat-pill"><span className="menu-stat-num">⏰</span><span className="menu-stat-label">4PM–10PM</span></div>
          </div>
        </div>
      </div>

      <div className="cat-bar">
        {CATS.map((c) => (
          <button
            key={c}
            className={`cat-btn ${activeCategory === c ? 'active' : ''}`}
            onClick={() => filterCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="menu-section">
        <div className="section-title"></div>
        <div className="menu-grid">
          {items.map((item) => (
            <div className={`menu-card ${item.available ? '' : 'unavailable'}`} key={item._id || item.name}>
              {!item.available && <span className="unavail-tag">Unavailable</span>}
              <div className="card-emoji">
                <img
                  className="food-img"
                  loading="lazy"
                  src={item.image?.trim() || '/img/default-food.png'}
                  alt={item.name}
                />
              </div>
              <div className="card-body">
                <div className="card-name">{item.name}</div>
                <div className="card-desc">{item.desc || 'Delicious freshly prepared item'}</div>
                <div className="card-footer">
                  <span className="card-price">₹{item.price}</span>
                  <span className={item.type === 'veg' ? 'tag-veg' : item.type === 'nonveg' ? 'tag-nonveg' : 'tag-beverage'}>
                    {item.type === 'veg' ? '🟢 Veg' : item.type === 'nonveg' ? '🔴 Non-Veg' : '🔵 Beverage'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

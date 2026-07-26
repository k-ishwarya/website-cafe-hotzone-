const categories = [
  { name: 'Burger', label: 'Burgers', emoji: '🍔' },
  { name: 'Pizza', label: 'Pizzas', emoji: '🍕' },
  { name: 'Sandwich', label: 'Sandwiches', emoji: '🥪' },
  { name: 'Mojito', label: 'Mojitos', emoji: '🍹' },
  { name: 'Milkshake', label: 'Milkshakes', emoji: '🥤' },
  { name: 'Meat', label: 'Meat', emoji: '🍖' },
]

const features = [
  { icon: '🔥', title: 'Grilled Fresh', desc: 'Every item cooked to order — no pre-made, no shortcuts.' },
  { icon: '🍕', title: 'Loaded Menu', desc: 'Burgers, Pizzas, Sandwiches, Mojitos & more under one roof.' },
  { icon: '✅', title: '100% Halal', desc: 'Certified halal ingredients — trusted by our community.' },
  { icon: '⏰', title: 'Open 4PM–10PM', desc: 'Evening vibes only — come hungry, leave happy.' },
]

export default function Home({ showPage, filterCat }) {
  const goToCategory = (cat) => {
    filterCat(cat)
    showPage('menu')
  }

  return (
    <section id="page-home">
      <div className="home-hero">
        <div className="home-hero-bg"></div>
        <div className="home-hero-content">
          <div className="hero-eyebrow">Udangudi's Finest · Est. 2020</div>
          <h1 className="home-title">Welcome to <span>HotZone</span></h1>
          <p className="home-sub">Fast food & grill crafted with fire, soul, and real flavour — right here in Tamil Nadu.</p>
          <div className="home-cta-row">
            <button className="btn btn-primary home-cta-btn" onClick={() => showPage('menu')}>
              🔥 Explore Menu
            </button>
          </div>
        </div>
      </div>

      <div className="home-features">
        <h2 className="home-section-title">Why <span>HotZone?</span></h2>
        <div className="home-feat-grid">
          {features.map((f) => (
            <div className="home-feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-stats">
        <div className="stat-item"><span className="stat-num">40+</span><span className="stat-label">Menu Items</span></div>
        <div className="stat-divider"></div>
        <div className="stat-item"><span className="stat-num">5★</span><span className="stat-label">Customer Love</span></div>
        <div className="stat-divider"></div>
        <div className="stat-item"><span className="stat-num">100%</span><span className="stat-label">Fresh Daily</span></div>
        <div className="stat-divider"></div>
        <div className="stat-item"><span className="stat-num">Halal</span><span className="stat-label">Certified</span></div>
      </div>

      <div className="home-cats">
        <h2 className="home-section-title">What's <span>Cooking?</span></h2>
        <div className="home-cat-grid">
          {categories.map((c) => (
            <div className="home-cat-card" key={c.name} onClick={() => goToCategory(c.name)}>
              <span className="cat-emoji">{c.emoji}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

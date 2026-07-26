export default function Navbar({ activePage, showPage }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'menu', label: 'Menu' },
  ]

  return (
    <nav>
      <div className="logo">
        <img src="/img/logo.jpeg" alt="logo" />
        <h4>Hot<span>Zone</span></h4>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.id}
            className={`nav-btn ${activePage === l.id ? 'active' : ''}`}
            onClick={() => showPage(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

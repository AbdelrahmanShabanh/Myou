import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileCats, setOpenMobileCats] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const isAdmin = !!localStorage.getItem('myou_admin_token');

  const toggleMobileCat = (id) => {
    setOpenMobileCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data.filter(c => c.active !== false));
      })
      .catch(() => {});
      
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
         <img src="/collections/Gemini_Generated_Image_uai0qyuai0qyuai0-removebg-preview.png" alt="Logo" className="logo-img" />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          
          {categories.filter(c => !c.parent).map(mainCat => {
            const subCats = categories.filter(c => c.parent && (c.parent._id === mainCat._id || c.parent === mainCat._id));
            const isActive = location.search.includes(`category=${mainCat.slug}`) || subCats.some(s => location.search.includes(`category=${s.slug}`));
            
            return (
              <div key={mainCat._id} className={subCats.length > 0 ? "nav-dropdown-container" : ""}>
                <Link to={`/products?category=${mainCat.slug}`} className={`nav-link ${isActive ? 'active' : ''}`} style={{textTransform: 'capitalize'}}>
                  {mainCat.name}
                </Link>
                {subCats.length > 0 && (
                  <div className="nav-dropdown">
                    <div className="dropdown-sub-menu">
                      {subCats.map(sub => (
                        <Link key={sub._id} to={`/products?category=${sub.slug}`} className="dropdown-link" style={{textTransform: 'capitalize'}}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <Link to="/track-order" className="nav-link">Track Order</Link>
          {isAdmin && <Link to="/admin/dashboard" className="nav-link nav-admin">Admin</Link>}
        </div>

        <div className="navbar-actions">
          {!isAdmin && (
            <Link to="/admin/login" className="cart-btn" aria-label="Admin Login">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}
          <button className="cart-btn" aria-label="Cart" onClick={toggleCart}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link">Home</Link>
          
          {categories.filter(c => !c.parent).map(mainCat => {
            const subCats = categories.filter(c => c.parent && (c.parent._id === mainCat._id || c.parent === mainCat._id));
            if (subCats.length > 0) {
              const isOpen = openMobileCats[mainCat._id];
              return (
                <div key={mainCat._id} className="mobile-dropdown-container">
                  <div className="mobile-link mobile-dropdown-header" onClick={() => toggleMobileCat(mainCat._id)}>
                    <span style={{textTransform: 'capitalize'}}>{mainCat.name}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                  {isOpen && (
                    <div className="mobile-dropdown-content">
                      {subCats.map(sub => (
                        <Link key={sub._id} to={`/products?category=${sub.slug}`} className="mobile-sub-link nested" style={{textTransform: 'capitalize'}}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={mainCat._id} to={`/products?category=${mainCat.slug}`} className="mobile-link" style={{textTransform: 'capitalize'}}>
                {mainCat.name}
              </Link>
            );
          })}
          
          <Link to="/track-order" className="mobile-link">Track Order</Link>
          {isAdmin && <Link to="/admin/dashboard" className="mobile-link mobile-admin">Admin</Link>}
        </div>
      )}

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
         background: rgb(199 199 199 / 60%);
          backdrop-filter: blur(10px);
          border-bottom-color: #f8a8d089;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(253, 232, 243, 0.8);
          backdrop-filter: blur(15px);
          border-bottom-color: #f8a8d089;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 1.5rem;
        }
        .navbar-logo {
          width: 100px;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          font-size: 1.2rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-genz {
          color: var(--accent);
        }
        .logo-front {
          color: var(--text);
          font-weight: 400;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          padding: 0.45rem 0.85rem;
          font-size: 0.88rem;
          font-weight: 500;
          color: #ffff;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text);
          background: var(--bg-elevated);
        }
        .nav-link.active {
          color: var(--accent);
        }
        .nav-admin {
          color: var(--accent) !important;
          border: 1px solid var(--accent);
        }
        
        .nav-dropdown-container {
          position: relative;
        }
        
        .nav-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          min-width: 180px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 100;
          padding: 0.5rem 0;
          pointer-events: none;
        }
        
        .nav-dropdown-container:hover .nav-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
        
        .dropdown-item-container {
          position: relative;
        }
        
        .dropdown-group-title {
          display: block;
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          color: var(--text);
          cursor: default;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .dropdown-sub-menu {
          display: flex;
          flex-direction: column;
        }
        
        .dropdown-link {
          display: block;
          padding: 0.6rem 1.25rem;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.2s, color 0.2s;
        }
        
        .main-direct-link {
          padding-left: 1.25rem;
          font-weight: 700;
          color: var(--text);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .dropdown-link:hover {
          background: var(--bg-elevated);
          color: var(--accent);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          color: var(--text);
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: var(--transition);
        }
        .cart-btn:hover {
          
          color: var(--accent);
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--accent);
          color: var(--primary);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          line-height: 1;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          background: none;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: var(--transition);
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 1.5rem 1rem;
          border-top: 1px solid var(--border);
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity:0; transform: translateY(-8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .mobile-link {
          padding: 0.75rem 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #686868;
          border-bottom: 1px solid var(--border);
          transition: color 0.2s;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link:hover { color: var(--accent); }
        .mobile-admin { color: var(--accent) !important; }

        .mobile-dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          width: 100%;
        }
        .mobile-dropdown-content {
          display: flex;
          flex-direction: column;
          background: rgba(0,0,0,0.03);
          border-radius: var(--radius-sm);
          margin: 0 0 0.5rem 0;
          padding: 0.5rem 0;
          overflow: hidden;
        }
        .mobile-sub-link {
          padding: 0.6rem 1.5rem;
          color: #6f636b;
          text-decoration: none;
          font-size: 0.95rem;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .mobile-sub-link:last-child {
          border-bottom: none;
        }
        .mobile-group-title {
          padding: 0.8rem 1.5rem 0.4rem;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mobile-group-title.link {
          display: block;
          text-decoration: none;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .mobile-sub-link.nested {
          padding-left: 2.5rem;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .navbar-links { display: none !important; }
          .hamburger { display: flex !important; }
          .navbar-inner { gap: 0.5rem; padding: 0 1rem; }
          .mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            width: 100%;
            background: rgb(255 255 255 / 95%);
            backdrop-filter: blur(20px);
            z-index: 99;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-genz">M </span>
              <span className="logo-front">You</span>
            </div>
            <p className="footer-tagline">Dress Different. Stay M You.</p>
            <p className="footer-sub">
              Premium Handpicked quality, unmatched aesthetic. Delivering fire
              fits since 2024.
            </p>
            <div className="footer-socials" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="https://www.facebook.com/share/1J4wL9Gxu2/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/m.you_brand?igsh=MTcwaGZwbG5xbG16Yg==" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@m.youbrand?_r=1&_t=ZS-94z8keHOAw3" target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.32 5.56C17.7 5.25 16.32 4.1 15.65 2.5H12v13.06c0 1.96-1.59 3.55-3.55 3.55S4.9 17.52 4.9 15.56s1.59-3.55 3.55-3.55c.29 0 .56.04.83.1v-3.7c-.27-.04-.55-.06-.83-.06-4 0-7.25 3.25-7.25 7.25s3.25 7.25 7.25 7.25 7.25-3.25 7.25-7.25V8.58c1.6.86 3.4 1.34 5.3 1.34V6.22c-1.12 0-2.18-.24-3.13-.66z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul>
              <li>
                <Link to="/products?category=modest-wear">Modest Wear</Link>
              </li>
              <li>
                <Link to="/products?category=swimwear">Swimwear</Link>
              </li>
              <li>
                <Link to="/products?category=accessories">Accessories</Link>
              </li>
              <li>
                <Link to="/products">All Products</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} M You. All rights reserved.</p>
          <p>
            <a
              href="https://wa.me/201070831335"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Made with ❤️ by <span style={{
                textDecoration:"underline",
                color:"black"
              }}>Abdelrahman Shaban</span> 
            </a>
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background: #F8A8D0;
          border-top: 1px solid var(--border);
          padding: 3rem 0 1.5rem;
          margin-top: 4rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-brand { }
        .footer-logo {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .footer-socials a {
          color: var(--text);
          transition: color 0.2s, transform 0.2s;
        }
        .footer-socials a:hover {
          color: var(--accent);
          transform: translateY(-2px);
        }
        .logo-genz { color: var(--accent); }
        .logo-front { color: var(--text); font-weight: 400; }
        .footer-tagline {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.4rem;
        }
        .footer-sub {
          font-size: 0.82rem;
          color: var(--text-subtle);
          line-height: 1.6;
        }
        .footer-heading {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #30292e;
          margin-bottom: 1rem;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-col li a,
        .footer-col li span {
          font-size: 0.85rem;
          color: var(--text-subtle);
          transition: color 0.2s;
        }
        .footer-col li a:hover { color: var(--accent); }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.78rem;
          color: var(--text-subtle);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}

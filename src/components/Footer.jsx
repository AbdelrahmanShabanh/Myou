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
              href="https://wa.me/201008872621"
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

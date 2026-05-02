import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('myou_admin_token');
    window.location.href = '/';
  };

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z' }, // Dashboard icon
    { to: '/admin/products', label: 'Products', icon: 'M18 10V6l-6-4-6 4v4H2v11h20V10zM12 4l4 2.67v2.66l-4-2.66-4 2.66V6.67L12 4zM4 12h16v7H4v-7z' }, // Box icon
    { to: '/admin/orders', label: 'Orders', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14v14M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z' }, // Analytics icon
    { to: '/admin/categories', label: 'Categories', icon: 'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z' }, // Grid icon
    { to: '/admin/discounts', label: 'Discounts', icon: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z' }, // Local_offer icon
    { to: '/admin/delivery', label: 'Delivery Fees', icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' } // Local_shipping icon
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d={link.icon} />
            </svg>
            {link.label}
          </NavLink>
        ))}
        {/* Mobile logout button (only visible via CSS on mobile) */}
        <button className="mobile-logout-btn sidebar-link" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Logout
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Logout
        </button>
      </div>
      
      <style>{`
        .admin-sidebar {
          width: 250px;
          min-height: calc(100vh - 80px); /* Adjust based on navbar height */
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 80px; /* Adjust based on navbar height */
          z-index: 10;
        }
        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-header h2 {
          font-size: 1.25rem;
          color: var(--accent);
          margin: 0;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .sidebar-link:hover {
          background: var(--bg-body);
          color: var(--text);
        }
        .sidebar-link.active {
          background: rgba(233, 30, 140, 0.1); /* accent with opacity */
          color: var(--accent);
          border-right: 3px solid var(--accent);
        }
        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .sidebar-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: var(--radius);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .sidebar-btn:hover {
          background: var(--bg-body);
          border-color: var(--text-muted);
        }

        .mobile-logout-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 100%;
            min-height: auto;
            position: relative;
            top: 0;
            border-right: none;
            border-bottom: 1px solid var(--border);
            z-index: 100;
          }
          .sidebar-header {
            display: none;
          }
          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 0.75rem;
            gap: 0.25rem;
            white-space: nowrap;
          }
          .sidebar-link {
            padding: 0.5rem 0.75rem;
            border-right: none !important; /* override the active right border */
            border-radius: var(--radius);
          }
          .sidebar-link.active {
            background: var(--accent);
            color: #fff;
          }
          .sidebar-footer {
            display: none; /* Hide standard footer */
          }
          .mobile-logout-btn {
            display: flex;
          }
        }
      `}</style>
    </aside>
  );
}
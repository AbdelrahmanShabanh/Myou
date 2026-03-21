import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("myou_admin_token");

    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("myou_admin_token");
          navigate("/admin/login");
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error("API error: " + res.status + " " + text);
        }
        return res.json();
      }),
      fetch("/api/admin/revenue", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([productsData, ordersData, revenueData]) => {
        setStats({
          products: Array.isArray(productsData) ? productsData.length : 0,
          orders: Array.isArray(ordersData) ? ordersData.length : 0,
        });
        if (revenueData) setRevenue(revenueData);
        setRecentOrders(
          Array.isArray(ordersData) ? ordersData.slice(0, 5) : [],
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("myou_admin_token");
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="admin-sub">Store overview and recent activity</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total Products</h3>
          <p className="stat-value">{stats.products}</p>
          <Link to="/admin/products" className="stat-link">
            Manage Products →
          </Link>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Total Orders</h3>
          <p className="stat-value">{stats.orders}</p>
          <Link to="/admin/orders" className="stat-link">
            Manage Orders →
          </Link>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Categories</h3>
          <p className="stat-value" style={{ fontSize: "2rem" }}>
            —
          </p>
          <Link to="/admin/categories" className="stat-link">
            Manage Categories →
          </Link>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Discounts</h3>
          <p className="stat-value" style={{ fontSize: "2rem" }}>
            —
          </p>
          <Link to="/admin/discounts" className="stat-link">
            Manage Discounts →
          </Link>
        </div>
        <div className="stat-card revenue-card">
          <h3 className="stat-title" style={{ color: "rgba(255,255,255,0.8)" }}>
            Total Revenue
          </h3>
          <p className="stat-value" style={{ color: "#fff" }}>
            {revenue.totalRevenue} EGP
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "auto",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <div>
              <strong>30d:</strong> {revenue.monthlyRevenue} EGP
            </div>
            <div>
              <strong>7d:</strong> {revenue.weeklyRevenue} EGP
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-head">
          <h2
            className="section-label"
            style={{ fontSize: "1rem", color: "var(--text)" }}
          >
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="nav-link"
            style={{ fontSize: "0.85rem" }}
          >
            View All
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="mono-id">{order._id.substring(0, 8)}</span>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.city}</td>
                  <td>
                    <strong>{order.total} EGP</strong>
                  </td>
                  <td>
                    <span className={`badge badge-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-page { padding-top: 3rem; padding-bottom: 6rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
        .admin-sub { color: var(--text-muted); margin-top: 0.25rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; display: flex; flex-direction: column; }
        .stat-title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.5rem; }
        .stat-value { font-size: 3.5rem; font-weight: 900; color: var(--accent); line-height: 1; margin-bottom: 1rem; }
        .stat-link { font-size: 0.85rem; font-weight: 600; color: var(--text); align-self: flex-start; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-light); width: 100%; transition: color 0.2s; }
        .stat-link:hover { color: var(--accent); }
        .revenue-card { background: linear-gradient(135deg, var(--accent), var(--color-accent-light)); border: none; box-shadow: 0 4px 15px rgba(233, 30, 140, 0.2); }
        .revenue-card .stat-title, .revenue-card .stat-value { color: white; }
        
        .admin-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .table-responsive { overflow-x: auto; }
        .mono-id { font-family: monospace; font-size: 0.85rem; color: var(--text-subtle); }
      `}</style>
    </div>
  );
}

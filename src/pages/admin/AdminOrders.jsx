import { useState, useEffect } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("myou_admin_token");
    try {
      const res = await fetch("/api/admin_orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("myou_admin_token");

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)),
    );

    try {
      const res = await fetch(`/api/admin_orders?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Revert on error
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="admin-page container container-sm">
      <div className="admin-header">
        <h1 className="section-title">Orders</h1>
        <p className="admin-sub">
          Manage customer orders and update shipping status
        </p>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID • Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total & Payment</th>
              <th style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <div
                    className="mono-id"
                    style={{ color: "var(--accent)", fontWeight: 700 }}
                  >
                    {order._id.substring(0, 8)}
                  </div>
                  <div
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}
                  >
                    {order.city}
                  </div>
                </td>
                <td>
                  <span className="items-count-badge">
                    {order.items.reduce((s, i) => s + i.qty, 0)} items
                  </span>
                </td>
                <td>
                  <strong>{order.total} EGP</strong>
                  <div style={{ marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px",
                        background:
                          (order.paymentMethod === "instapay" || order.paymentMethod === "vodafone_cash")
                            ? "var(--color-accent-soft)"
                            : "var(--bg-elevated)",
                        color:
                          (order.paymentMethod === "instapay" || order.paymentMethod === "vodafone_cash")
                            ? "var(--color-accent)"
                            : "var(--text-muted)",
                      }}
                    >
                      {order.paymentMethod === "instapay" ? "InstaPay" : order.paymentMethod === "vodafone_cash" ? "Vodafone Cash" : "COD"}
                    </span>
                  </div>
                  {(order.paymentMethod === "instapay" || order.paymentMethod === "vodafone_cash") &&
                    (order.instapayScreenshot || order.vodafoneScreenshot) && (
                      <div style={{ marginTop: "8px" }}>
                        <a
                          href={order.instapayScreenshot || order.vodafoneScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--info)",
                            textDecoration: "underline",
                          }}
                        >
                          View Screenshot
                        </a>
                      </div>
                    )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <select
                    className={`status-select bg-${order.status}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "3rem" }}
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .items-count-badge { background: var(--bg-elevated); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.75rem; font-weight: 600; color: var(--text-muted); }
        .status-select {
          appearance: none;
          padding: 0.4rem 2rem 0.4rem 0.85rem;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid transparent;
          cursor: pointer;
          outline: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          transition: var(--transition);
        }
        .status-select:hover { filter: brightness(1.2); }
        .bg-pending { background-color: var(--bg-elevated); color: var(--text-muted); border-color: var(--border-light); }
        .bg-confirmed { background-color: rgba(59,130,246,0.15); color: #60a5fa; border-color: rgba(59,130,246,0.3); }
        .bg-delivered { background-color: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.3); }
        .bg-cancelled { background-color: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3); }
      `}</style>
    </div>
  );
}

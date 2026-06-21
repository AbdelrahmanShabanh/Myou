import { useState, useEffect } from "react";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   bg: "rgba(234,179,8,0.15)",   color: "#facc15", border: "rgba(234,179,8,0.3)" },
  confirmed: { label: "Confirmed", bg: "rgba(59,130,246,0.15)",  color: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  delivered: { label: "Delivered", bg: "rgba(34,197,94,0.15)",   color: "#4ade80", border: "rgba(34,197,94,0.3)" },
  cancelled: { label: "Cancelled", bg: "rgba(239,68,68,0.15)",   color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

const PAYMENT_LABELS = {
  cash_on_delivery: "Cash on Delivery",
  instapay:         "InstaPay",
  vodafone_cash:    "Vodafone Cash",
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-EG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function buildWhatsAppSummary(order) {
  const itemLines = order.items
    .map(
      (i) =>
        `• ${i.name}${i.size ? ` | Size: ${i.size}` : ""}${i.color ? ` | Color: ${i.color}` : ""} | Qty: ${i.qty} | Price: ${i.price} EGP`,
    )
    .join("\n");

  return (
    `*New Order from ${order.customerName}*\n\n` +
    `*Contact:*\n📞 ${order.phone}\n\n` +
    `*Address:*\n📍 ${order.city}\n🏠 ${order.address}\n\n` +
    `📦 *Order Items*\n${itemLines}\n\n` +
    `💰 *Total: ${order.total} EGP*\n` +
    `💳 *Payment:* ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}` +
    (order.notes ? `\n📝 *Notes:* ${order.notes}` : "")
  );
}

function OrderCard({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied]     = useState(false);
  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const handleCopy = () => {
    navigator.clipboard.writeText(buildWhatsAppSummary(order));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ao-card" style={{ borderLeft: `3px solid ${sc.color}` }}>
      {/* ── Card Header ── */}
      <div className="ao-card-header" onClick={() => setExpanded((v) => !v)}>
        <div className="ao-header-left">
          <span className="ao-order-id">#{order._id.slice(-8).toUpperCase()}</span>
          <span className="ao-date">{formatDate(order.createdAt)}</span>
        </div>

        <div className="ao-header-meta">
          <span className="ao-customer-name">{order.customerName}</span>
          <span className="ao-city">{order.city}</span>
        </div>

        <div className="ao-header-right">
          <span className="ao-total">{order.total} EGP</span>
          <span
            className="ao-status-badge"
            style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
          >
            {sc.label}
          </span>
          <span className="ao-chevron" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
            ▾
          </span>
        </div>
      </div>

      {/* ── Expanded Detail Panel ── */}
      {expanded && (
        <div className="ao-detail-panel">
          {/* Left: Customer info */}
          <div className="ao-detail-section">
            <h4 className="ao-section-label">👤 Customer Details</h4>
            <div className="ao-info-grid">
              <div className="ao-info-row">
                <span className="ao-info-icon">📛</span>
                <div>
                  <div className="ao-info-key">Full Name</div>
                  <div className="ao-info-val">{order.customerName}</div>
                </div>
              </div>
              <div className="ao-info-row">
                <span className="ao-info-icon">📞</span>
                <div>
                  <div className="ao-info-key">Phone</div>
                  <div className="ao-info-val">
                    <a href={`tel:${order.phone}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                      {order.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="ao-info-row">
                <span className="ao-info-icon">📍</span>
                <div>
                  <div className="ao-info-key">Governorate</div>
                  <div className="ao-info-val">{order.city}</div>
                </div>
              </div>
              <div className="ao-info-row">
                <span className="ao-info-icon">🏠</span>
                <div>
                  <div className="ao-info-key">Address</div>
                  <div className="ao-info-val">{order.address}</div>
                </div>
              </div>
              {order.notes && (
                <div className="ao-info-row">
                  <span className="ao-info-icon">📝</span>
                  <div>
                    <div className="ao-info-key">Notes</div>
                    <div className="ao-info-val" style={{ color: "var(--text-muted)" }}>{order.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Order items */}
          <div className="ao-detail-section">
            <h4 className="ao-section-label">📦 Order Items</h4>
            <div className="ao-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="ao-item-row">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="ao-item-img"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <div className="ao-item-info">
                    <div className="ao-item-name">
                      <a
                        href={`/products/${item.productId || item._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--accent)", textDecoration: "underline" }}
                      >
                        {item.name}
                      </a>
                    </div>
                    <div className="ao-item-meta">
                      {item.size  && <span className="ao-tag">Size: {item.size}</span>}
                      {item.color && <span className="ao-tag">Color: {item.color}</span>}
                      <span className="ao-tag">Qty: {item.qty}</span>
                      <span className="ao-tag ao-tag-price">{item.price} EGP × {item.qty} = {(item.price * item.qty).toFixed(0)} EGP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="ao-totals">
              <div className="ao-total-row">
                <span>Subtotal</span>
                <span>{order.items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(0)} EGP</span>
              </div>
              <div className="ao-total-row ao-total-final">
                <span>Total Paid</span>
                <span>{order.total} EGP</span>
              </div>
            </div>
          </div>

          {/* Right: Payment + Actions */}
          <div className="ao-detail-section">
            <h4 className="ao-section-label">💳 Payment</h4>
            <div className="ao-payment-badge">
              {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
            </div>

            {(order.instapayScreenshot || order.vodafoneScreenshot) && (
              <a
                href={order.instapayScreenshot || order.vodafoneScreenshot}
                target="_blank"
                rel="noopener noreferrer"
                className="ao-screenshot-link"
              >
                🖼 View Payment Screenshot
              </a>
            )}

            <h4 className="ao-section-label" style={{ marginTop: "1.5rem" }}>⚙️ Status</h4>
            <select
              className={`ao-status-select ao-status-${order.status}`}
              value={order.status}
              onChange={(e) => onStatusChange(order._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* WhatsApp copy button */}
            <h4 className="ao-section-label" style={{ marginTop: "1.5rem" }}>📲 WhatsApp</h4>
            <button className="ao-wa-btn" onClick={handleCopy}>
              {copied ? "✅ Copied!" : "📋 Copy Order Message"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppSummary(order))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ao-wa-open-btn"
            >
              💬 Open in WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("myou_admin_token");
    try {
      const res  = await fetch("/api/admin_orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("myou_admin_token");
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)),
    );
    try {
      const res = await fetch(`/api/admin_orders?id=${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) fetchOrders();
    } catch {
      fetchOrders();
    }
  };

  const displayed = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.phone?.includes(q) ||
        o.city?.toLowerCase().includes(q) ||
        o._id.includes(q)
      );
    });

  const counts = orders.reduce(
    (acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; },
    {},
  );

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
        <p className="admin-sub">Full customer &amp; order details from the database</p>
      </div>

      {/* ── Stats row ── */}
      <div className="ao-stats-row">
        {["all", "pending", "confirmed", "delivered", "cancelled"].map((s) => {
          const sc  = STATUS_CONFIG[s];
          const cnt = s === "all" ? orders.length : (counts[s] || 0);
          return (
            <button
              key={s}
              className={`ao-stat-btn ${filter === s ? "ao-stat-active" : ""}`}
              style={filter === s && sc ? { borderColor: sc.color, color: sc.color } : {}}
              onClick={() => setFilter(s)}
            >
              <span className="ao-stat-count">{cnt}</span>
              <span className="ao-stat-label">{sc ? sc.label : "All Orders"}</span>
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div className="ao-search-wrap">
        <span className="ao-search-icon">🔍</span>
        <input
          className="ao-search-input"
          type="text"
          placeholder="Search by name, phone, city or order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="ao-search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* ── Order cards ── */}
      <div className="ao-cards-list">
        {displayed.length === 0 ? (
          <div className="ao-empty">No orders found.</div>
        ) : (
          displayed.map((order) => (
            <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* Stats row */
        .ao-stats-row {
          display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;
        }
        .ao-stat-btn {
          flex: 1; min-width: 90px; display: flex; flex-direction: column;
          align-items: center; padding: 0.75rem 1rem;
          background: var(--bg-elevated); border: 1px solid var(--border-light);
          border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);
          color: var(--text-muted);
        }
        .ao-stat-btn:hover { border-color: var(--accent); color: var(--text); }
        .ao-stat-active { background: var(--bg-elevated) !important; font-weight: 700; }
        .ao-stat-count { font-size: 1.5rem; font-weight: 800; line-height: 1; }
        .ao-stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.25rem; }

        /* Search */
        .ao-search-wrap {
          position: relative; display: flex; align-items: center;
          margin-bottom: 1.5rem;
          background: var(--bg-elevated); border: 1px solid var(--border-light);
          border-radius: var(--radius-sm); padding: 0 1rem;
        }
        .ao-search-icon { font-size: 1rem; margin-right: 0.5rem; opacity: 0.5; }
        .ao-search-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--text); padding: 0.75rem 0; font-size: 0.9rem;
        }
        .ao-search-clear {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 0.85rem; padding: 0.25rem;
        }

        /* Cards list */
        .ao-cards-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .ao-empty { text-align: center; padding: 4rem; color: var(--text-muted); font-size: 1rem; }

        /* Card */
        .ao-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .ao-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }

        /* Card header */
        .ao-card-header {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.25rem; cursor: pointer;
          flex-wrap: wrap;
        }
        .ao-header-left { display: flex; flex-direction: column; min-width: 110px; }
        .ao-order-id { font-family: monospace; font-size: 0.85rem; font-weight: 700; color: var(--accent); }
        .ao-date { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
        .ao-header-meta { flex: 1; display: flex; flex-direction: column; }
        .ao-customer-name { font-weight: 700; font-size: 0.95rem; }
        .ao-city { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
        .ao-header-right { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
        .ao-total { font-weight: 800; font-size: 0.95rem; }
        .ao-status-badge {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 0.25rem 0.65rem; border-radius: 999px;
        }
        .ao-chevron {
          color: var(--text-muted); font-size: 1rem;
          transition: transform 0.25s ease; display: inline-block;
        }

        /* Expanded detail panel */
        .ao-detail-panel {
          display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 0;
          border-top: 1px solid var(--border-light);
        }
        @media (max-width: 800px) {
          .ao-detail-panel { grid-template-columns: 1fr; }
        }
        .ao-detail-section {
          padding: 1.25rem 1.5rem;
          border-right: 1px solid var(--border-light);
        }
        .ao-detail-section:last-child { border-right: none; }
        .ao-section-label {
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em;
          color: var(--text-muted); margin: 0 0 0.85rem;
          padding-bottom: 0.4rem; border-bottom: 1px solid var(--border-light);
        }

        /* Info grid */
        .ao-info-grid { display: flex; flex-direction: column; gap: 0.75rem; }
        .ao-info-row { display: flex; align-items: flex-start; gap: 0.65rem; }
        .ao-info-icon { font-size: 1rem; margin-top: 2px; flex-shrink: 0; }
        .ao-info-key { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1px; }
        .ao-info-val { font-size: 0.9rem; font-weight: 600; }

        /* Items list */
        .ao-items-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .ao-item-row {
          display: flex; align-items: flex-start; gap: 0.75rem;
          background: var(--bg-base, rgba(0,0,0,0.15));
          border-radius: var(--radius-sm); padding: 0.65rem 0.85rem;
        }
        .ao-item-img {
          width: 44px; height: 44px; object-fit: cover;
          border-radius: 6px; border: 1px solid var(--border-light); flex-shrink: 0;
        }
        .ao-item-name { font-size: 0.88rem; font-weight: 600; margin-bottom: 4px; }
        .ao-item-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .ao-tag {
          font-size: 0.7rem; padding: 0.15rem 0.4rem;
          background: var(--bg-elevated); border: 1px solid var(--border-light);
          border-radius: 4px; color: var(--text-muted);
        }
        .ao-tag-price { color: var(--accent) !important; border-color: var(--accent) !important; font-weight: 700; }

        /* Totals */
        .ao-totals {
          border-top: 1px solid var(--border-light); padding-top: 0.75rem;
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .ao-total-row {
          display: flex; justify-content: space-between;
          font-size: 0.85rem; color: var(--text-muted);
        }
        .ao-total-final {
          font-weight: 800; font-size: 1rem;
          color: var(--text) !important; margin-top: 0.25rem;
        }

        /* Payment */
        .ao-payment-badge {
          display: inline-block; font-size: 0.8rem; font-weight: 700;
          padding: 0.35rem 0.85rem; border-radius: 999px;
          background: var(--color-accent-soft, rgba(var(--accent-rgb,255,193,7),0.12));
          color: var(--accent); border: 1px solid var(--accent);
          margin-bottom: 0.75rem;
        }
        .ao-screenshot-link {
          display: block; font-size: 0.8rem; color: var(--info, #60a5fa);
          text-decoration: underline; margin-bottom: 0.5rem;
        }

        /* Status select */
        .ao-status-select {
          width: 100%; appearance: none; padding: 0.5rem 2.5rem 0.5rem 0.85rem;
          border-radius: var(--radius-pill, 999px); font-size: 0.78rem;
          font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          border: 1px solid transparent; cursor: pointer; outline: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 0.75rem center;
          transition: var(--transition);
        }
        .ao-status-pending   { background-color: var(--bg-elevated); color: #facc15; border-color: rgba(234,179,8,0.4); }
        .ao-status-confirmed { background-color: rgba(59,130,246,0.15); color: #60a5fa; border-color: rgba(59,130,246,0.35); }
        .ao-status-delivered { background-color: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.35); }
        .ao-status-cancelled { background-color: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.35); }
        .ao-status-select:hover { filter: brightness(1.15); }

        /* WhatsApp buttons */
        .ao-wa-btn, .ao-wa-open-btn {
          display: block; width: 100%; text-align: center;
          padding: 0.55rem 1rem; border-radius: var(--radius-sm);
          font-size: 0.82rem; font-weight: 700; cursor: pointer;
          transition: var(--transition); text-decoration: none;
          margin-bottom: 0.5rem;
        }
        .ao-wa-btn {
          background: var(--bg-base, rgba(0,0,0,0.2));
          border: 1px solid var(--border-light); color: var(--text);
        }
        .ao-wa-btn:hover { background: var(--border-light); }
        .ao-wa-open-btn {
          background: #25D366; color: #fff; border: none;
        }
        .ao-wa-open-btn:hover { background: #1ebe57; }
      `}</style>
    </div>
  );
}

import { useCart } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { cldSrc, CLD_W } from "../utils/cloudinary.js";

export default function CartDrawer() {
  const { t } = useLanguage();
  const {
    isCartOpen,
    closeCart,
    items,
    updateQty,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        onClick={closeCart}
      />
      <div className={`cart-drawer-container ${isCartOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h2>
            {t("shoppingCart")} <span>({cartCount})</span>
          </h2>
          <button className="close-drawer-btn" onClick={closeCart}>
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🛒</div>
              <h3>{t("cartEmptyMsg")}</h3>
              <p>{t("notAddedAnything")}</p>
              <button className="btn btn-primary mt-4" onClick={closeCart}>
                {t("startShopping")}
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}-${item.color}`}
                  className="drawer-item"
                >
                  <div className="drawer-item-img">
                    <img
                      src={cldSrc(item.product.images?.[0], CLD_W.THUMBNAIL)}
                      alt={item.product.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="drawer-item-info">
                    <div className="drawer-item-header">
                      <Link
                        to={`/products/${item.product._id}`}
                        onClick={closeCart}
                        className="drawer-item-name"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        className="drawer-item-remove"
                        onClick={() =>
                          removeFromCart(
                            item.product._id,
                            item.size,
                            item.color,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                    <div className="drawer-item-meta">
                      {t("sizeLabel")} {item.size}{" "}
                      {item.color ? `· ${item.color}` : ""}
                    </div>

                    <div className="drawer-item-bottom">
                      <div className="drawer-qty-stepper">
                        <button
                          onClick={() =>
                            updateQty(
                              item.product._id,
                              item.size,
                              item.color,
                              item.qty - 1,
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() =>
                            updateQty(
                              item.product._id,
                              item.size,
                              item.color,
                              item.qty + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="drawer-item-price">
                        {item.product.price} {t("egp")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-subtotal">
              <span>{t("subtotal")}</span>
              <span className="drawer-total-price">
                {cartTotal} {t("egp")}
              </span>
            </div>
            <p className="drawer-tax-note">{t("taxesShipping")}</p>
            <button
              className="btn btn-primary drawer-checkout-btn"
              onClick={handleCheckout}
            >
              {t("proceedToCheckout")}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
          z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .cart-overlay.open { opacity: 1; pointer-events: auto; }
        
        .cart-drawer-container {
          position: fixed; top: 0; right: 0; bottom: 0; width: 420px; max-width: 100vw;
          background: var(--bg); z-index: 1000; transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          display: flex; flex-direction: column;
          box-shadow: -5px 0 30px rgba(0,0,0,0.2);
        }
        .cart-drawer-container.open { transform: translateX(0); }
        
        .cart-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem; border-bottom: 1px solid var(--border);
        }
        .cart-drawer-header h2 { font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
        .cart-drawer-header h2 span { color: var(--text-muted); font-size: 1rem; font-weight: 500; }
        .cart-close-btn { background: none; border: none; font-size: 1.2rem; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
        .cart-close-btn:hover { color: var(--error); }
        
        .cart-drawer-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
        
        .cart-empty-state { text-align: center; margin-top: 3rem; color: var(--text-muted); }
        .cart-empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
        .cart-empty-state h3 { font-size: 1.25rem; color: var(--text); margin-bottom: 0.5rem; }
        .cart-empty-state p { font-size: 0.9rem; }
        
        .cart-drawer-items { display: flex; flex-direction: column; gap: 1.5rem; }
        .drawer-item { display: flex; gap: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.5rem; }
        .drawer-item:last-child { border-bottom: none; padding-bottom: 0; }
        
        .drawer-item-img { width: 80px; height: 100px; border-radius: 6px; overflow: hidden; background: #111; flex-shrink: 0; }
        .drawer-item-img img { width: 100%; height: 100%; object-fit: cover; }
        
        .drawer-item-info { flex: 1; display: flex; flex-direction: column; }
        .drawer-item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
        .drawer-item-name { font-weight: 700; font-size: 0.95rem; line-height: 1.3; transition: color 0.2s; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .drawer-item-name:hover { color: var(--accent); }
        .drawer-item-remove { background: none; border: none; color: var(--text-subtle); cursor: pointer; font-size: 0.8rem; padding: 2px; transition: color 0.2s; }
        .drawer-item-remove:hover { color: var(--error); }
        
        .drawer-item-meta { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
        
        .drawer-item-bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 0.75rem; }
        
        .drawer-qty-stepper { display: flex; align-items: center; border: 1px solid var(--border); border-radius: 4px; background: var(--bg-elevated); height: 32px; }
        .drawer-qty-stepper button { width: 28px; height: 100%; background: none; border: none; color: var(--text); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
        .drawer-qty-stepper button:hover { color: var(--accent); }
        .drawer-qty-stepper span { width: 24px; text-align: center; font-size: 0.85rem; font-weight: 600; }
        
        .drawer-item-price { font-weight: 800; font-size: 0.95rem; }
        
        .cart-drawer-footer { padding: 1.5rem; border-top: 1px solid var(--border); background: var(--bg-elevated); }
        .drawer-subtotal { display: flex; justify-content: space-between; align-items: center; font-weight: 600; margin-bottom: 0.5rem; font-size: 1.1rem; }
        .drawer-total-price { font-size: 1.25rem; font-weight: 900; color: var(--accent); }
        .drawer-tax-note { font-size: 0.75rem; color: var(--text-subtle); margin-bottom: 1.25rem; }
        .drawer-checkout-btn { width: 100%; padding: 1rem; font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; }
        .mt-4 { margin-top: 1.5rem; }
      `}</style>
    </>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        const availableSizes = data.sizes?.filter((s) => s.stock > 0) || [];
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0].size);
        } else if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].size); // Just pick first if all out of stock
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAdd = () => {
    let hasErr = false;
    if (!selectedSize) {
      setSizeError(true);
      hasErr = true;
    } else {
      setSizeError(false);
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setColorError(true);
      hasErr = true;
    } else {
      setColorError(false);
    }

    if (hasErr) return;

    addToCart(product, selectedSize, selectedColor);

    // Show quick toast
    const btn = document.getElementById("add-btn");
    const originalText = btn.innerText;
    btn.innerText = t("addedToCart");
    btn.style.backgroundColor = "var(--success)";
    btn.style.color = "#fff";
    setTimeout(() => {
      if (btn) {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }
    }, 2000);
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  if (error)
    return (
      <div className="container" style={{ padding: "5rem 0" }}>
        <div className="alert alert-error">{error}</div>
        <Link
          to="/products"
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
        >
          Back to Shop
        </Link>
      </div>
    );
  if (!product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const selectedSizeObj = product.sizes?.find((s) => s.size === selectedSize);
  const inStock = hasSizes
    ? selectedSizeObj
      ? selectedSizeObj.stock > 0
      : false
    : product.stock > 0;
  const displayStock =
    hasSizes && selectedSizeObj ? selectedSizeObj.stock : product.stock;

  return (
    <div className="product-detail-page container">
      <div className="breadcrumb">
        <Link to="/">{t("home")}</Link> <span className="sep">/</span>
        <Link to="/products">{t("shop")}</Link> <span className="sep">/</span>
        <Link
          to={`/products?category=${product.category}`}
          style={{ textTransform: "capitalize" }}
        >
          {product.category}
        </Link>{" "}
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="detail-grid">
        {/* Images */}
        <div className="detail-gallery">
          <div className="main-image-wrap">
            <img
              src={product.images?.[mainImage] || ""}
              alt={product.name}
              className="main-image"
            />
            {!inStock && (
              <div className="sold-out-badge">{t("outOfStock")}</div>
            )}
            {product.featured && (
              <div className="featured-badge">{t("featured")}</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="thumb-strip">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb-btn ${mainImage === i ? "active" : ""}`}
                  onClick={() => setMainImage(i)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="thumb-img"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-price">{product.price} EGP</p>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            <span
              className={`status-dot ${inStock ? "in-stock" : "out-stock"}`}
            />
            {inStock
              ? `${displayStock} ${t("itemsAvailable")}`
              : t("currentlyOut")}
          </div>

          <div className="detail-section">
            <div className="section-head">
              <span className="section-label">{t("selectSize")}</span>
              <button
                className="size-guide-btn"
                onClick={() => setShowSizeChart(true)}
              >
                {t("sizeGuide")}
              </button>
            </div>
            <div className="size-selector">
              {product.sizes?.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  className={`size-btn-lg ${selectedSize === sizeObj.size ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSize(sizeObj.size);
                    setSizeError(false);
                  }}
                  disabled={sizeObj.stock <= 0}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
            {sizeError && <p className="error-text">{t("selectSizeError")}</p>}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="detail-section">
              <div className="section-head">
                <span className="section-label">Select Color</span>
              </div>
              <div className="color-selector" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.colors.map((color) => {
                  const cleanedStr = color.trim();
                  // A simple generic regex matching basic english color names or hex matching would work, 
                  // but we use the exact string as background too if valid CSS color like "blue" or "red".
                  return (
                    <button
                      key={color}
                      className={`color-btn-lg ${selectedColor === color ? "active" : ""}`}
                      style={{
                        backgroundColor: cleanedStr,
                        padding: '10px 20px',
                        border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: ['white', 'yellow', 'cyan', 'lime'].includes(cleanedStr.toLowerCase()) ? 'black' : 'white',
                        fontWeight: 'bold',
                        opacity: 0.9,
                      }}
                      onClick={() => {
                        setSelectedColor(color);
                        setColorError(false);
                      }}
                    >
                      {cleanedStr}
                    </button>
                  );
                })}
              </div>
              {colorError && <p className="error-text">Please select a color</p>}
            </div>
          )}

          <div className="detail-actions">
            <button
              id="add-btn"
              className="btn btn-primary btn-lg full-width"
              onClick={handleAdd}
              disabled={!inStock}
            >
              {inStock ? t("addToCart") : t("outOfStock")}
            </button>
            <button
              className="btn btn-dark btn-lg full-width"
              onClick={() => {
                if (inStock) {
                  handleAdd();
                  navigate("/checkout");
                }
              }}
              disabled={!inStock}
            >
              {t("buyNow")}
            </button>
          </div>

          <div className="detail-meta">
            {product.material && (
              <div className="meta-item">
                <span className="meta-label">{t("material")}</span>
                <span className="meta-value">{product.material}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">{t("category")}</span>
              <span
                className="meta-value"
                style={{ textTransform: "capitalize" }}
              >
                {product.category}
              </span>
            </div>
          </div>

          <div className="shipping-banner">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
              <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
            <div>
              <strong>{t("fastDelivery")}</strong>
              <p>{t("fastDeliveryDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      {showSizeChart && (
        <div
          className="size-chart-modal"
          onClick={() => setShowSizeChart(false)}
        >
          <div
            className="size-chart-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setShowSizeChart(false)}
            >
              ✕
            </button>
            <img
              src="/size-chart.jpg"
              alt="Size Chart"
              className="size-chart-img"
            />
          </div>
        </div>
      )}

      <style>{`
        .product-detail-page {
          padding-top: 2rem;
          padding-bottom: 6rem;
        }
        .breadcrumb {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          display: flex;
          gap: 0.5rem;
        }
        .breadcrumb a:hover { color: var(--accent); }
        .sep { color: var(--border-light); }
        .current { color: var(--text); font-weight: 500; }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .detail-gallery {
          min-width: 0;
        }
        .main-image-wrap {
          position: relative;
          aspect-ratio: 4/5;
          background: #111;
          border-radius: var(--radius);
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sold-out-badge, .featured-badge {
          position: absolute;
          padding: 0.4rem 1rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          font-size: 0.8rem;
          border-radius: var(--radius-sm);
        }
        .sold-out-badge { bottom: 1.5rem; left: 1.5rem; background: var(--error); color: white; }
        .featured-badge { top: 1.5rem; left: 1.5rem; background: var(--accent); color: var(--primary); }
        
        .thumb-strip {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          flex-wrap: nowrap;
          padding-bottom: 0.5rem;
          width: 100%;
        }
        .thumb-strip::-webkit-scrollbar {
          height: 6px;
        }
        .thumb-strip::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .thumb-btn {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          transition: border-color 0.2s;
        }
        .thumb-btn.active { border-color: var(--accent); }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        
        .detail-info {
          display: flex;
          flex-direction: column;
        }
        .detail-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }
        .detail-price {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 1.5rem;
        }
        .detail-desc {
          font-size: 1.05rem;
          color: var(--text-subtle);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .detail-stock {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2rem;
          padding: 0.75rem 1rem;
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .status-dot.in-stock { background: var(--success); box-shadow: 0 0 10px var(--success); }
        .status-dot.out-stock { background: var(--error); box-shadow: 0 0 10px var(--error); }
        
        .detail-section { margin-bottom: 2.5rem; }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .size-guide-btn {
          background: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: underline;
        }
        .size-guide-btn:hover { color: var(--text); }
        .size-selector {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 0.75rem;
        }
        .size-btn-lg {
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-light);
          background: var(--bg-card);
          color: var(--text);
          font-weight: 700;
          font-size: 1rem;
          transition: var(--transition);
        }
        .size-btn-lg:hover:not(:disabled) { border-color: #555; }
        .size-btn-lg.active {
          border-color: var(--accent);
          background: var(--accent);
          color: var(--primary);
        }
        .size-btn-lg:disabled { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }
        .error-text { color: var(--error); font-size: 0.85rem; margin-top: 0.5rem; font-weight: 500; }
        
        .detail-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .full-width { width: 100%; }
        
        .detail-meta {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 0;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .meta-item { display: flex; gap: 1rem; font-size: 0.9rem; }
        .meta-label { width: 100px; color: var(--text-muted); font-weight: 600; }
        .meta-value { color: var(--text); font-weight: 500; }
        
        .shipping-banner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: var(--radius-sm);
          color: #60a5fa;
        }
        .shipping-banner strong { display: block; margin-bottom: 0.2rem; color: #93c5fd; }
        .shipping-banner p { font-size: 0.85rem; margin: 0; }
        
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; }
          .main-image-wrap { aspect-ratio: 1; }
        }

        /* Size Chart Modal */
        .size-chart-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 1rem;
        }
        .size-chart-content {
          background: #fff;
          padding: 1.5rem;
          border-radius: var(--radius);
          position: relative;
          max-width: 500px;
          margin: auto;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .close-modal {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
        }
        .size-chart-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { cldSrc, CLD_W } from "../utils/cloudinary.js";

export default function Products() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorObj, setErrorObj] = useState(null);

  // Parse filters from URL
  const filters = {
    category: searchParams.get("category") || "",
    sizes: searchParams.get("sizes")
      ? searchParams.get("sizes").split(",")
      : [],
    maxPrice: Number(searchParams.get("maxPrice")) || 600,
    search: searchParams.get("search") || "",
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let url = "/api/products";
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);

    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await fetch(url);
      let data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch products");

      // Client-side filtering for size and price (since our simple API doesn't support it)
      if (filters.sizes.length > 0) {
        data = data.filter((p) =>
          p.sizes.some((s) => filters.sizes.includes(s.size)),
        );
      }
      if (filters.maxPrice < 600) {
        data = data.filter((p) => p.price <= filters.maxPrice);
      }

      setProducts(data);
      setErrorObj(null);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setErrorObj(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.category,
    filters.search,
    filters.sizes.join(","),
    filters.maxPrice,
  ]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.sizes?.length)
      params.set("sizes", newFilters.sizes.join(","));
    if (newFilters.maxPrice < 600) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.search) params.set("search", newFilters.search);
    setSearchParams(params);
  };

  const currentCat = categories.find((c) => c.slug === filters.category);
  const subCategories =
    currentCat && !currentCat.parent
      ? categories.filter(
          (c) =>
            c.parent &&
            (c.parent._id === currentCat._id || c.parent === currentCat._id),
        )
      : [];

  return (
    <div className="products-page container">
      <div className="page-header">
        <h1 className="section-title">{t("shopAll")}</h1>
        <p className="page-subtitle">
          {t("showing")}{" "}
          {loading
            ? "..."
            : subCategories.length > 0
              ? `${subCategories.length} ${t("categoriesText")}`
              : `${products.length} ${t("resultsText")}`}
        </p>
      </div>

      <div className="products-layout">
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          categories={categories}
        />

        <div className="products-main">
          {filters.search && (
            <div className="search-banner">
              Search results for: <strong>"{filters.search}"</strong>
              <button
                onClick={() => handleFilterChange({ ...filters, search: "" })}
                className="clear-search-btn"
              >
                ✕
              </button>
            </div>
          )}

          {subCategories.length > 0 && (
            <div className="subcategories-grid">
              {subCategories.map((sub) => (
                <Link
                  key={sub._id}
                  to={`/products?category=${sub.slug}`}
                  className="cat-card sub-card"
                >
                  <img
                    src={cldSrc(sub.image, CLD_W.CATEGORY_CARD) || "/collections/caps.jpg"}
                    alt={sub.name}
                    className="cat-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="cat-overlay">
                    <h3 className="cat-title">{sub.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {subCategories.length === 0 && (
            <div className="product-grid">
              {loading ? (
                Array(8)
                  .fill()
                  .map((_, i) => <SkeletonCard key={i} />)
              ) : errorObj ? (
                <div
                  className="empty-state"
                  style={{ gridColumn: "1/-1", color: "var(--error)" }}
                >
                  <h3>API Connection Error</h3>
                  <p>{errorObj}</p>
                </div>
              ) : products.length > 0 ? (
                products.map((p) => <ProductCard key={p._id} product={p} />)
              ) : (
                <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                  <div className="empty-state-icon">😕</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      handleFilterChange({
                        category: "",
                        sizes: [],
                        maxPrice: 600,
                      })
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .products-page {
          padding-top: 3rem;
          padding-bottom: 6rem;
        }
        .page-header {
          margin-bottom: 3rem;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1.5rem;
        }
        .page-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .products-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .search-banner {
          background: var(--bg-elevated);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 3px solid var(--accent);
          font-size: 0.95rem;
        }
        .clear-search-btn {
          background: none;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .clear-search-btn:hover { color: var(--text); }
        
        .subcategories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .sub-card {
          position: relative;
          border-radius: var(--radius);
          overflow: hidden;
          aspect-ratio: 4/5;
          text-decoration: none;
          background: var(--bg-card);
          display: block;
        }
        .sub-card .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .sub-card:hover .cat-img {
          transform: scale(1.05);
        }
        .sub-card .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }
        .sub-card .cat-title {
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          margin: 0;
        }

        @media (max-width: 900px) {
          .products-layout { grid-template-columns: 220px 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr; gap: 2rem; }
          .page-header { flex-direction: column; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}

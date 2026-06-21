import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import DiscountScroller from "../components/DiscountScroller.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { cldSrc, CLD_W } from "../utils/cloudinary.js";

export default function Home() {
  const { t } = useLanguage();
  const [discounts, setDiscounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [offerProducts, setOfferProducts] = useState([]);

  useEffect(() => {
    fetch("/api/discounts")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setDiscounts(data))
      .catch(() => {});

    fetch("/api/categories?parents=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        setLoadingCats(false);
      })
      .catch(() => setLoadingCats(false));

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          setOfferProducts(data.filter((p) => p.isOffer));
        setLoadingOffers(false);
      })
      .catch(() => setLoadingOffers(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-accent">
              {t("heroTitlePart1") || "Dress"}
            </span>{" "}
            {t("heroTitlePart2") || "Different."}
            <br />
            {t("heroTitlePart3") || "Stay"}{" "}
            <span className="hero-accent">
              {t("heroTitlePart4") || "M You."}
            </span>
          </h1>
          <p className="hero-subtitle">{t("heroSubtitle")}</p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary btn-lg">
              {t("shopNewDrops") || "Shop New Drops"}
            </Link>
          </div>
        </div>
        <div className="hero-bg">
          <div className="hero-gradient" />
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="/collections/_SHG8409.jpg"
            />
            <img
              src="/collections/caps.jpg"
              alt="Streetwear Hero"
              className="hero-img"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
        </div>
      </section>

      <DiscountScroller discounts={discounts} />

      {/* Offers Section */}
      {(loadingOffers || offerProducts.length > 0) && (
        <section
          className="offers-section container"
          style={{ paddingTop: "5rem" }}
        >
          <div className="section-header text-center">
            <p className="section-label">
              {t("limitedTime") || "Limited Time Only"}
            </p>
            <h2 className="section-title">{t("specialOffers")}</h2>
          </div>
          <div className="offers-scroller">
            {loadingOffers
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="offer-card-wrapper">
                    <div
                      className="cat-card skeleton"
                      style={{ height: "420px", borderRadius: "var(--radius)" }}
                    ></div>
                  </div>
                ))
              : offerProducts.map((p) => (
                  <div key={p._id} className="offer-card-wrapper">
                    <ProductCard product={p} />
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Dynamic Categories */}
      <section
        className="categories-section container"
        style={{ paddingTop: offerProducts.length > 0 ? "2rem" : "5rem" }}
      >
        <div className="section-header text-center">
          <p className="section-label">{t("shopBy") || "Shop by"}</p>
          <h2 className="section-title">{t("categories")}</h2>
        </div>

        <div className="cat-dynamic-grid">
          {loadingCats ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="cat-card skeleton"></div>
            ))
          ) : (
            <>
              {categories
                .filter((c) => c.active !== false)
                .map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat.slug}`}
                    className="cat-card"
                  >
                    <img
                      src={cldSrc(cat.image, CLD_W.CATEGORY_CARD) || "/collections/caps.jpg"}
                      alt={cat.name}
                      className="cat-img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="cat-overlay">
                      <h3 className="cat-title">{cat.name}</h3>
                      <span className="cat-link">{t("shopNow")} →</span>
                    </div>
                  </Link>
                ))}
              {categories.length === 0 && (
                <p
                  className="empty-text text-center"
                  style={{ gridColumn: "1/-1", width: "100%" }}
                >
                  No categories found.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        .hero {
          position: relative;
          min-height: 95vh;
          display: flex;
          align-items: center;
          padding: 6rem 5%;
          overflow: hidden;
          margin-top: -64px; /* offset navbar */
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .hero-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          color: white;
        }
        .hero-accent {
          color: var(--accent);
          display: inline-block;
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: rgba(255,255,255,0.85);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          font-weight: 300;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--bg) 10%, rgba(13,13,12,0.2) 26%, rgba(13,13,13,0.4) 77%);
          z-index: 2;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .featured-section {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .text-center {
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }
        
        .categories-section {
          padding-bottom: 6rem;
        }
        .offers-scroller {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1.5rem;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .offer-card-wrapper {
          flex: 0 0 280px;
          scroll-snap-align: start;
        }
        .offers-scroller::-webkit-scrollbar {
          height: 6px;
        }
        .offers-scroller::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .cat-dynamic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        .cat-card {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: block;
          height: 350px;
        }
        .skeleton {
          background: linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: skeletonLoading 1.5s ease-in-out infinite;
        }
        @keyframes skeletonLoading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (min-width: 768px) {
          .cat-dynamic-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2rem;
          transition: background 0.3s;
        }
        .cat-card:hover .cat-img {
          transform: scale(1.05);
        }
        .cat-card:hover .cat-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
        }
        .cat-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }
        .cat-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .cat-card:hover .cat-link {
          opacity: 1;
        }
        .empty-text {
          color: var(--text-muted);
          grid-column: 1 / -1;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .cat-card {
            height:400px
          }
          .hero-gradient {
            background: linear-gradient(to top, var(--bg) 10%, rgba(13,13,12,0.2) 26%, rgba(13,13,13,0.4) 77%);
          }
        }
      `}</style>
    </div>
  );
}

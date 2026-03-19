import { useRef } from 'react';

export default function DiscountScroller({ discounts }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  if (!discounts || discounts.length === 0) return null;

  return (
    <section style={{ position: 'relative', padding: '40px 0' }}>
      <h2 style={{ fontFamily: 'Playfair Display', textAlign: 'center', marginBottom: 24 }}>
        Exclusive Offers
      </h2>

      {/* Left arrow */}
      <button onClick={() => scroll(-1)} style={{
        position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
        width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #E91E8C',
        background: 'white', color: '#E91E8C', cursor: 'pointer', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
      }}>‹</button>

      {/* Scroll container */}
      <div ref={scrollRef} style={{
        display: 'flex', gap: 16, overflowX: 'auto', scrollBehavior: 'smooth',
        padding: '8px 48px', scrollbarWidth: 'none', msOverflowStyle: 'none'
      }}>
        {discounts.map(d => (
          <a key={d._id} href={d.linkUrl || '/products'} style={{
            minWidth: 300, borderRadius: 16, padding: 20, textDecoration: 'none',
            backgroundColor: d.backgroundColor || '#FDE8F3',
            color: d.textColor || '#E91E8C', flexShrink: 0, display: 'block'
          }}>
            {d.image && (
              <img src={d.image} alt={d.title} style={{
                width: '100%', height: 150, objectFit: 'cover', borderRadius: 12, marginBottom: 12
              }} />
            )}
            {d.discountPercent && (
              <span style={{
                background: '#E91E8C', color: 'white', borderRadius: 999,
                padding: '3px 12px', fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'inline-block'
              }}>{d.discountPercent}% OFF</span>
            )}
            <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700, margin: '8px 0 4px' }}>
              {d.title}
            </div>
            {d.subtitle && <div style={{ fontSize: 14, opacity: 0.85 }}>{d.subtitle}</div>}
            {d.code && (
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600 }}>
                Code: <span style={{ background: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: 6 }}>{d.code}</span>
              </div>
            )}
            {d.expiresAt && (
              <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>
                Ends {new Date(d.expiresAt).toLocaleDateString()}
              </div>
            )}
            <div style={{ marginTop: 14, fontWeight: 600, fontSize: 14 }}>Shop Now →</div>
          </a>
        ))}
      </div>

      {/* Right arrow */}
      <button onClick={() => scroll(1)} style={{
        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
        width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #E91E8C',
        background: 'white', color: '#E91E8C', cursor: 'pointer', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
      }}>›</button>
    </section>
  );
}

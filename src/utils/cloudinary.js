/**
 * cloudinary.js  –  Centralised Cloudinary URL builder
 *
 * RULES enforced on every URL:
 *  1. f_auto  – serves WebP/AVIF to browsers that support it
 *  2. q_auto  – Cloudinary picks the best quality level
 *  3. w_{width},c_limit  – never upscale; cap to the requested width
 *  4. No version numbers / timestamps / random params  → stable CDN cache key
 *  5. Non-Cloudinary URLs (local /collections/*, /size-chart.jpg …) are
 *     returned unchanged so the helper is safe to call on any src string.
 */

const UPLOAD_RE = /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/)?/i;

/**
 * Returns an optimised Cloudinary URL.
 *
 * @param {string|null|undefined} src    – raw image URL stored in the DB
 * @param {number}                width  – display width in CSS pixels (used for w_ cap)
 * @returns {string}
 */
export function cldSrc(src, width) {
  if (!src || !UPLOAD_RE.test(src)) return src || "";

  // Strip any existing transformation segment + version number, then rebuild
  // This prevents duplicate transforms like f_auto,q_auto/f_auto,q_auto
  const withoutVersion = src.replace(UPLOAD_RE, "$1");

  // Remove any already-injected transformation block so we start clean
  const parts = withoutVersion.split("/upload/");
  if (parts.length !== 2) return src; // unexpected format, leave untouched

  const transforms = `f_auto,q_auto${width ? `,w_${width},c_limit` : ""}`;
  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
}

/**
 * Convenience presets – use these constants instead of raw numbers so that
 * changing a layout only requires one edit here.
 *
 * Naming convention: cldW_<context>
 */
export const CLD_W = {
  THUMBNAIL:      80,   // admin table, cart drawer, order item thumbs
  CARD:          480,   // product card grid (~280 px on screen × 2× dpr)
  CATEGORY_CARD: 600,   // category/sub-category hero cards
  DETAIL_MAIN:   900,   // product detail main image (50 vw, max ~900 px)
  DETAIL_THUMB:  160,   // product detail thumbnail strip
  DISCOUNT:      600,   // discount scroller banner
  ADMIN_PREVIEW: 120,   // admin form image preview
  NAVBAR_LOGO:   200,   // site logo
};

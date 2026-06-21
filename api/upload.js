import { verifyAdmin } from "./_lib/auth.js";
import cloudinary from "./_lib/cloudinary.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyAdmin(req, res)) return;

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const result = await cloudinary.uploader.upload(image, {
      folder: "genzfront-products",
      // Request auto quality & format on delivery (not baked into the stored file)
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    // Build a stable, CDN-cacheable URL:
    //  1. Strip the version segment (v1234567890/) – it changes on every upload
    //     and causes CDN cache misses for the same asset.
    //  2. Inject f_auto,q_auto so browsers always receive WebP/AVIF at the
    //     optimal quality without us having to duplicate transformation params
    //     everywhere in the frontend.
    let url = result.secure_url;

    // Remove version token: …/upload/v1234567890/folder/… → …/upload/folder/…
    url = url.replace(/(\/image\/upload\/)v\d+\//, "$1");

    // Inject f_auto,q_auto if not already present
    if (!url.includes("f_auto")) {
      url = url.replace(
        /(\/image\/upload\/)/i,
        "$1f_auto,q_auto/",
      );
    }

    return res.status(200).json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

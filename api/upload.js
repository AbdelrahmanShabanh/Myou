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
      // Ensure transformation uses best practices
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    // Cloudinary might return secure_url without explicit auto-format tags if added in transformation depending on settings.
    // We can manually add them to the URL to be 100% sure we are delivering f_auto,q_auto.
    let optimizedUrl = result.secure_url;
    if (
      optimizedUrl.includes("res.cloudinary.com") &&
      !optimizedUrl.includes("f_auto")
    ) {
      optimizedUrl = optimizedUrl.replace(
        /(res\.cloudinary\.com\/.*?\/image\/upload\/)/i,
        "$1f_auto,q_auto/",
      );
    }

    return res.status(200).json({ url: optimizedUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

import { connectDB, Product } from "./_lib/db.js";
import { verifyAdmin } from "./_lib/auth.js";
import Category from "./_lib/models/Category.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    if (id) {
      const category = await Category.findById(id).populate("parent");
      return res.json(category);
    } else {
      const parentOnly = req.query.parents === "true";
      const activeOnly = req.query.all !== "true"; // if 'all' is passed, fetch including inactive
      const query = {};
      if (activeOnly) query.active = true;
      if (parentOnly) query.parent = null;

      const categories = await Category.find(query).populate("parent");
      return res.json(categories);
    }
  }

  if (req.method === "POST") {
    if (!verifyAdmin(req, res)) return;
    try {
      if (!req.body.name)
        return res.status(400).json({ error: "Name is required" });
      const slug = req.body.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const category = await Category.create({ ...req.body, slug });
      return res.status(201).json(category);
    } catch (err) {
      if (err.code === 11000)
        return res.status(400).json({ error: "Category already exists" });
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "PUT") {
    if (!verifyAdmin(req, res)) return;
    try {
      const updated = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.json(updated);
    } catch (err) {
      if (err.code === 11000)
        return res.status(400).json({ error: "Slug must be unique" });
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    if (!verifyAdmin(req, res)) return;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const count = await Product.countDocuments({ category: category.slug });
    if (count > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete a category that has products." });
    }

    const subCount = await Category.countDocuments({ parent: id });
    if (subCount > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete a category that has subcategories." });
    }

    await Category.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

import { connectDB } from '../_lib/db.js';
import { verifyAdmin } from '../_lib/auth.js';
import Category from '../_lib/models/Category.js';
import Product from '../_lib/models/Product.js';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const category = await Category.findById(id);
    return res.json(category);
  }

  if (req.method === 'PUT') {
    if (!verifyAdmin(req, res)) return;
    try {
      const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updated);
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ error: 'Slug must be unique' });
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!verifyAdmin(req, res)) return;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    const count = await Product.countDocuments({ category: category.slug });
    if (count > 0) {
      return res.status(400).json({ error: 'Cannot delete a category that has products. Remove or reassign those products first.' });
    }
    
    await Category.findByIdAndDelete(id);
    return res.json({ success: true });
  }
}

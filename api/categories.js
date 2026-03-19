import { connectDB } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';
import Category from './_lib/models/Category.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const categories = await Category.find({ active: true });
    return res.json(categories);
  }

  if (req.method === 'POST') {
    if (!verifyAdmin(req, res)) return;
    try {
      if (!req.body.name) return res.status(400).json({ error: 'Name is required' });
      const slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const category = await Category.create({ ...req.body, slug });
      return res.status(201).json(category);
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ error: 'Category already exists' });
      return res.status(500).json({ error: err.message });
    }
  }
}

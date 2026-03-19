import { connectDB } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';
import Discount from './_lib/models/Discount.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const now = new Date();
    const discounts = await Discount.find({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    });
    return res.json(discounts);
  }

  if (req.method === 'POST') {
    if (!verifyAdmin(req, res)) return;
    const discount = await Discount.create(req.body);
    return res.status(201).json(discount);
  }

  if (req.method === 'PUT') {
    if (!verifyAdmin(req, res)) return;
    const updated = await Discount.findByIdAndUpdate(id, req.body, { new: true });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    if (!verifyAdmin(req, res)) return;
    await Discount.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

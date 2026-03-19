import { connectDB } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';
import Discount from './_lib/models/Discount.js';

export default async function handler(req, res) {
  await connectDB();

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
}

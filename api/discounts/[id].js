import { connectDB } from '../_lib/db.js';
import { verifyAdmin } from '../_lib/auth.js';
import Discount from '../_lib/models/Discount.js';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

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
}

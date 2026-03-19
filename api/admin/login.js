import jwt from 'jsonwebtoken';
import { connectDB } from '../_lib/db.js';
import User from '../_lib/models/User.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { email, password } = req.body;

    let isValid = false;

    // Check environment fallback first
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      isValid = true;
    } else {
      // Check MongoDB users
      const user = await User.findOne({ email });
      if (user && user.password === password && user.role === 'admin') {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

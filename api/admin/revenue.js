import { connectDB, Order } from '../_lib/db.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyAdmin(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    try {
      const allOrders = await Order.find();
      
      let totalRevenue = 0;
      let monthlyRevenue = 0;
      let weeklyRevenue = 0;

      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      for (const order of allOrders) {
        if (order.status !== 'confirmed' && order.status !== 'delivered') continue;

        totalRevenue += order.total;
        
        const orderDate = new Date(order.createdAt);
        if (orderDate >= oneMonthAgo) {
          monthlyRevenue += order.total;
        }
        if (orderDate >= oneWeekAgo) {
          weeklyRevenue += order.total;
        }
      }

      return res.status(200).json({
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

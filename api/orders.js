import { connectDB, Order } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json(order);
      }
      return res.status(400).json({ error: 'Order ID required' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { customerName, phone, address, city, items, total } = req.body;

      if (!customerName || !phone || !address || !city || !items?.length || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order = new Order(req.body);
      await order.save();
      
      const { Product } = await import('./_lib/db.js');
      // Decrement stock
      for (const item of items) {
        if (item.productId && item.size) {
          await Product.updateOne(
            { _id: item.productId, "sizes.size": item.size },
            { 
              $inc: { 
                "stock": -item.qty,
                "sizes.$.stock": -item.qty
              } 
            }
          );
        }
      }

      return res.status(201).json(order);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

import { connectDB, Order } from "./_lib/db.js";
import { verifyAdmin } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!verifyAdmin(req, res)) return;

  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    if (req.method === "PATCH") {
      const { status } = req.body;
      const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const order = await Order.findById(req.query.id || req.body.id);
      if (!order) return res.status(404).json({ error: "Order not found" });

      const oldStatus = order.status;
      order.status = status;
      await order.save();

      const { Product } = await import("../_lib/db.js");

      if (oldStatus !== "cancelled" && status === "cancelled") {
        for (const item of order.items) {
          if (item.productId && item.size) {
            await Product.updateOne(
              { _id: item.productId, "sizes.size": item.size },
              { $inc: { stock: item.qty, "sizes.$.stock": item.qty } },
            );
          } else if (item.productId && !item.size) {
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: item.qty } },
            );
          }
        }
      } else if (oldStatus === "cancelled" && status !== "cancelled") {
        for (const item of order.items) {
          if (item.productId && item.size) {
            await Product.updateOne(
              { _id: item.productId, "sizes.size": item.size },
              { $inc: { stock: -item.qty, "sizes.$.stock": -item.qty } },
            );
          } else if (item.productId && !item.size) {
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: -item.qty } },
            );
          }
        }
      }

      return res.status(200).json(order);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error in /api/admin_orders:", err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}

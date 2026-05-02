import { connectDB, DeliveryFee } from './_lib/db.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const fees = await DeliveryFee.find({});
      return res.status(200).json(fees);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { governorates } = req.body; // array of { governorate, fee }
      
      const operations = governorates.map((item) => ({
        updateOne: {
          filter: { governorate: item.governorate },
          update: { $set: { fee: item.fee } },
          upsert: true
        }
      }));

      if (operations.length > 0) {
        await DeliveryFee.bulkWrite(operations);
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
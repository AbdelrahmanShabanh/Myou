import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

let isConnected = false;

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, default: 0 },
    },
  ],
  stock: { type: Number, default: 0 },
  images: [String],
  material: { type: String },
  featured: { type: Boolean, default: false },
  isOffer: { type: Boolean, default: false },
  oldPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      size: String,
      qty: Number,
      price: Number,
      image: String,
    },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash_on_delivery", "instapay", "vodafone_cash"],
    default: "cash_on_delivery",
  },
  instapayScreenshot: { type: String },
  vodafoneScreenshot: { type: String },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const DeliveryFeeSchema = new mongoose.Schema({
  governorate: { type: String, required: true, unique: true },
  fee: { type: Number, required: true, default: 100 },
});

export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const DeliveryFee =
  mongoose.models.DeliveryFee ||
  mongoose.model("DeliveryFee", DeliveryFeeSchema);

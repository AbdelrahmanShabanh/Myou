import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  discountPercent: { type: Number },
  code: { type: String },
  image: { type: String },
  backgroundColor: { type: String, default: '#FDE8F3' },
  textColor: { type: String, default: '#E91E8C' },
  linkUrl: { type: String, default: '/products' },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Discount || mongoose.model('Discount', DiscountSchema);

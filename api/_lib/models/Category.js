import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

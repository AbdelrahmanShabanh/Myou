import { connectDB, Product } from './_lib/db.js';
import Category from './_lib/models/Category.js';

const defaultSizes = [
  { size: 'S', stock: 10 },
  { size: 'M', stock: 15 },
  { size: 'L', stock: 10 },
  { size: 'XL', stock: 5 }
];

const imgList = [
  '/collections/caps.webp',
  '/collections/kimono.webp',
  '/collections/scarves.webp',
  '/collections/cover up.webp',
  '/collections/_SHG8409.webp',
  '/collections/stain scarves1.webp'
];

const getRandomImg = () => imgList[Math.floor(Math.random() * imgList.length)];

const sampleCategories = [
  { name: 'Modest Wear', slug: 'modest-wear', description: 'Elegant and modest outfits.', image: getRandomImg(), active: true },
  { name: 'Accessories', slug: 'accessories', description: 'Caps, scarves, and bags.', image: getRandomImg(), active: true },
  { name: 'Swimwear', slug: 'swimwear', description: 'Stylish burkinis and cover ups.', image: getRandomImg(), active: true },
];

const sampleProducts = [
  {
    name: 'Satin Scarves Collection',
    description: 'Premium satin scarves for everyday elegance.',
    price: 349,
    category: 'accessories',
    sizes: [{ size: 'OS', stock: 50 }],
    stock: 50,
    images: ['/collections/stain scarves1.webp', '/collections/scarves.webp'],
    material: '100% Satin',
    featured: true
  },
  {
    name: 'Classic Black Cap',
    description: 'Bold black cap. A M You wardrobe staple.',
    price: 399,
    category: 'accessories',
    sizes: [{ size: 'OS', stock: 30 }],
    stock: 30,
    images: ['/collections/caps.webp'],
    material: 'Cotton Canvas',
    featured: false
  },
  {
    name: 'Elegant Kimono',
    description: 'Versatile kimono. Style meets everyday comfort.',
    price: 899,
    category: 'modest-wear',
    sizes: defaultSizes,
    stock: 40,
    images: ['/collections/kimono.webp'],
    material: 'Linen Blend',
    featured: true
  },
  {
    name: 'Summer Cover Up',
    description: 'Lightweight cover up for the beach or pool.',
    price: 549,
    category: 'swimwear',
    sizes: defaultSizes,
    stock: 40,
    images: ['/collections/cover up.webp', '/collections/cover up sada.webp'],
    material: 'Chiffon',
    featured: true
  },
  {
    name: 'Active Burkini',
    description: 'Full coverage modest swimwear.',
    price: 1199,
    category: 'swimwear',
    sizes: defaultSizes,
    stock: 40,
    images: ['/collections/burkini.webp'],
    material: 'Water-resistant nylon',
    featured: false
  },
  {
    name: 'Signature Collection Piece',
    description: 'A standout item from our latest drop.',
    price: 1499,
    category: 'modest-wear',
    sizes: defaultSizes,
    stock: 40,
    images: ['/collections/_SHG8409.webp'],
    material: 'Premium Blend',
    featured: true
  }
];

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST to seed' });

  try {
    await connectDB();
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    // Seed categories
    await Category.insertMany(sampleCategories);
    
    // Seed products
    const products = await Product.insertMany(sampleProducts);
    
    return res.status(201).json({ message: `Seeded ${products.length} products and 3 categories successfully`, count: products.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

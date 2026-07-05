import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';

// Pull the existing static data straight from the client app so the
// database starts out matching exactly what's on the live storefront today.
import { products as clientProducts } from '../../../client/src/data/products.js';
import { categories as clientCategories } from '../../../client/src/data/categories.js';

async function seed() {
  await connectDB();

  console.log('Seeding categories...');
  await Category.deleteMany({});
  await Category.insertMany(clientCategories);
  console.log(`  -> ${clientCategories.length} categories inserted`);

  console.log('Seeding products...');
  await Product.deleteMany({});
  const productDocs = clientProducts.map((p) => ({
    slug: p.id,
    category: p.category,
    brand: p.brand,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice,
    badge: p.badge || '',
    featured: !!p.featured,
    image: p.image,
    gallery: [],
    inStock: p.inStock !== false,
    stockQty: 10,
  }));
  await Product.insertMany(productDocs);
  console.log(`  -> ${productDocs.length} products inserted`);

  console.log('Seeding admin account...');
  const adminUsername = (process.env.ADMIN_SEED_USERNAME || 'admin').toLowerCase();
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'akcomputers2026';

  const existingAdmin = await Admin.findOne({ username: adminUsername });
  if (existingAdmin) {
    console.log(`  -> Admin "${adminUsername}" already exists, skipping`);
  } else {
    await Admin.create({ username: adminUsername, password: adminPassword, name: 'AK Admin' });
    console.log(`  -> Admin "${adminUsername}" created`);
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

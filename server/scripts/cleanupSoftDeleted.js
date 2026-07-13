// One-time cleanup: removes old soft-deleted products left over from
// before the DELETE endpoint was switched to a real hard delete.
// Run once from the server/ folder:  node scripts/cleanupSoftDeleted.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Product.deleteMany({ isDeleted: true });
  console.log(`Removed ${result.deletedCount} old soft-deleted product(s) from MongoDB.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

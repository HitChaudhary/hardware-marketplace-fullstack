import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    badge: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    description: { type: String, default: '' },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} }, // Handles flexible nested fields like RAM, Storage, CPU, etc.
    inStock: { type: Boolean, default: true },
    stockQty: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Database Layer Guard: Auto-build clean URL slugs if omitted during raw API creation
productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')         // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')     // Remove invalid symbols
      .replace(/\-\-+/g, '-');       // Clear duplicate stacked dashes
  }
  next();
});

// Compound Search Index with intelligent keyword ranking weights
productSchema.index(
  { 
    name: 'text', 
    brand: 'text', 
    category: 'text', 
    description: 'text' 
  },
  {
    weights: {
      name: 10,
      brand: 5,
      category: 3,
      description: 1
    }
  }
);

export default mongoose.model('Product', productSchema);
import mongoose from 'mongoose';

const inquiryItemSchema = new mongoose.Schema(
  {
    // Stored as a slug/static-id string (e.g. "feat-1", "nl-3") because the
    // storefront still reads from static data/products.js. Once the storefront
    // is fully wired to /api/products this can become an ObjectId ref, but for
    // now String prevents the BSONError when the frontend sends a slug.
    product: { type: String, default: '' },
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    message: { type: String, default: '' },
    items: [inquiryItemSchema],
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'closed', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);

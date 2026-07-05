import mongoose from 'mongoose';

const buildComponentSchema = new mongoose.Schema(
  {
    // The slot name displayed in the UI (e.g., "Processor (CPU)", "Graphics Card (GPU)")
    slotName: {
      type: String,
      required: true,
      unique: true,
    },
    // The machine-readable identifier used for filtering routes (e.g., "cpu", "gpu", "ram")
    slotSlug: {
      type: String,
      required: true,
      unique: true,
    },
    // Array of references linking directly to the Product model collection documents
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    // Determines the ordering position in the PC Builder step list
    stepOrder: {
      type: Number,
      default: 0,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BuildComponent = mongoose.model('BuildComponent', buildComponentSchema);
export default BuildComponent;
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import fs from 'fs';
import Product from '../models/Product.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadFile } from '../utils/cloudinary.js'; // Adjust this path to your cloudinary utility file

const router = Router();

// Configure local temporary file storage for handling incoming files
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB max
  fileFilter: (req, file, cb) => {
    // Only accept common image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * NEW ROUTE: POST /api/products/upload-image
 * Handles secure admin image uploading directly to Cloudinary
 */
router.post(
  '/upload-image',
  protectAdmin,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
      }

      // Upload file to Cloudinary using your helper logic
      const result = await uploadFile(req.file.path);

      // Clean up/delete the temporary local file inside your uploads folder
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to clean up local file:', err);
      });

      // Return the secure Cloudinary URL directly back to your frontend
      return res.status(200).json({ 
        success: true, 
        imageUrl: result.secure_url 
      });
    } catch (err) {
      // Clean up the temp file if the upload crashed midway
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(err);
    }
  }
);

// GET /api/products — public, with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { category, brand, q, featured } = req.query;
    const filter = { isDeleted: { $ne: true } };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (featured) filter.featured = featured === 'true';
    if (q) filter.$text = { $search: q };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug — public, single product
// Accepts either a slug or a raw Mongo _id so links built from either
// value (e.g. deal cards that only had the database id) still resolve.
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isObjectId
      ? { $or: [{ slug }, { _id: slug }], isDeleted: { $ne: true } }
      : { slug, isDeleted: { $ne: true } };
    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products — admin only
router.post(
  '/',
  protectAdmin,
  [
    body('slug').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('brand').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('price').isNumeric(),
    body('image').trim().notEmpty().withMessage('Image URL/path string is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const product = await Product.create(req.body);
      res.status(201).json({ product });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/products/:id — admin only
router.put('/:id', protectAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id — admin only (soft delete)
router.delete('/:id', protectAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;
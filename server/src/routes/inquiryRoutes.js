import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Inquiry from '../models/Inquiry.js';
import { protectCustomer, protectAdmin } from '../middleware/auth.js';

const router = Router();

const STATUSES = ['new', 'contacted', 'in-progress', 'closed', 'cancelled'];

// POST /api/inquiries — customer only, must be logged in
router.post(
  '/',
  protectCustomer,
  [
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one product is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const { phone, email, message, items, address } = req.body;

      const inquiry = await Inquiry.create({
        user: req.user._id,
        name: req.user.name,
        phone,
        email: email || req.user.email,
        message: message || '',
        items,
        address: address || {},
      });

      res.status(201).json({ inquiry });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/inquiries — admin only, all inquiries
router.get('/', protectAdmin, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const inquiries = await Inquiry.find(filter).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ inquiries });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/inquiries/:id/status — admin only
router.patch('/:id/status', protectAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(', ')}` });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json({ inquiry });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/inquiries/:id — admin only
router.delete('/:id', protectAdmin, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json({ message: 'Inquiry deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;

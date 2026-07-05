import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Inquiry from '../models/Inquiry.js';
import { protectCustomer, protectAdmin } from '../middleware/auth.js';

const router = Router();

// PUT /api/users/me — update profile
router.put('/me', protectCustomer, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (name) req.user.name = name;
    if (phone) req.user.phone = phone;
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/me/password — change password
router.put(
  '/me/password',
  protectCustomer,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const user = await User.findById(req.user._id).select('+password');
      const match = await user.comparePassword(req.body.currentPassword);
      if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });

      user.password = req.body.newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully.' });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/me/addresses
router.get('/me/addresses', protectCustomer, async (req, res) => {
  res.json({ addresses: req.user.addresses });
});

// POST /api/users/me/addresses
router.post(
  '/me/addresses',
  protectCustomer,
  [
    body('line1').trim().notEmpty().withMessage('Address line 1 is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('pincode').trim().notEmpty().withMessage('Pincode is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const { label, line1, line2, city, state, pincode, isDefault } = req.body;

      if (isDefault) {
        req.user.addresses.forEach((a) => {
          a.isDefault = false;
        });
      }

      req.user.addresses.push({
        label: label || 'Home',
        line1,
        line2: line2 || '',
        city,
        state,
        pincode,
        isDefault: isDefault || req.user.addresses.length === 0,
      });

      await req.user.save();
      res.status(201).json({ addresses: req.user.addresses });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/users/me/addresses/:addressId
router.put('/me/addresses/:addressId', protectCustomer, async (req, res, next) => {
  try {
    const addr = req.user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found.' });

    const { label, line1, line2, city, state, pincode, isDefault } = req.body;
    if (label !== undefined) addr.label = label;
    if (line1 !== undefined) addr.line1 = line1;
    if (line2 !== undefined) addr.line2 = line2;
    if (city !== undefined) addr.city = city;
    if (state !== undefined) addr.state = state;
    if (pincode !== undefined) addr.pincode = pincode;

    if (isDefault) {
      req.user.addresses.forEach((a) => {
        a.isDefault = false;
      });
      addr.isDefault = true;
    }

    await req.user.save();
    res.json({ addresses: req.user.addresses });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/me/addresses/:addressId
router.delete('/me/addresses/:addressId', protectCustomer, async (req, res, next) => {
  try {
    const addr = req.user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found.' });
    addr.deleteOne();
    await req.user.save();
    res.json({ addresses: req.user.addresses });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/me/inquiries — current customer's own inquiries
router.get('/me/inquiries', protectCustomer, async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ inquiries });
  } catch (err) {
    next(err);
  }
});

// GET /api/users — admin: list all registered customers
router.get('/', protectAdmin, async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
            { phone: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(filter).sort({ createdAt: -1 });

    const withCounts = await Promise.all(
      users.map(async (u) => {
        const inquiryCount = await Inquiry.countDocuments({ user: u._id });
        return { ...u.toSafeObject(), inquiryCount };
      })
    );

    res.json({ customers: withCounts });
  } catch (err) {
    next(err);
  }
});

export default router;

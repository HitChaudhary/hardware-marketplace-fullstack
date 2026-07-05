import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { protectCustomer } from '../middleware/auth.js';

const router = Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    // .normalizeEmail() handles lowering the case and formatting automatically
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { name, email, phone, password, address } = req.body;

      // express-validator transformed req.body.email to lowercase natively
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const addresses = [];
      if (address && (address.line1 || address.city)) {
        addresses.push({
          label: address.label || 'Home',
          line1: address.line1 || '',
          line2: address.line2 || '',
          city: address.city || '',
          state: address.state || '',
          pincode: address.pincode || '',
          isDefault: true,
        });
      }

      const user = await User.create({ name, email, phone, password, addresses });

      const token = signToken({ id: user._id, role: 'customer' });
      res.status(201).json({ token, user: user.toSafeObject() });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Query executes cleanly using sanitized validation outcomes
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ message: 'Incorrect email or password.' });

      const match = await user.comparePassword(password);
      if (!match) return res.status(401).json({ message: 'Incorrect email or password.' });

      const token = signToken({ id: user._id, role: 'customer' });
      res.json({ token, user: user.toSafeObject() });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me
router.get('/me', protectCustomer, async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

export default router;
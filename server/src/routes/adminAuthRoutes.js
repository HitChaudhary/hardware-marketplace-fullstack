import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Admin from '../models/Admin.js';
import { signToken } from '../utils/token.js';

const router = Router();

router.post(
  '/login',
  [body('username').trim().notEmpty(), body('password').notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const { username, password } = req.body;
      const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
      if (!admin) return res.status(401).json({ message: 'Incorrect username or password.' });

      const match = await admin.comparePassword(password);
      if (!match) return res.status(401).json({ message: 'Incorrect username or password.' });

      const token = signToken({ id: admin._id, role: 'admin' });
      res.json({ token, admin: { id: admin._id, username: admin.username, name: admin.name } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

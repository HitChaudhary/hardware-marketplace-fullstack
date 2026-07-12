import { verifyToken } from '../utils/token.js';
import Admin from '../models/Admin.js';

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies?.token) return req.cookies.token;
  return null;
}

export async function protectAdmin(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Admin authentication required.' });

    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'This action requires an admin account.' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: 'Admin account no longer exists.' });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired admin session.' });
  }
}

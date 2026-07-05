import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function InquirySentPage() {
  const { inquiryId } = useParams();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Display a short reference — the full MongoDB _id is long, so show last 8 chars
  const shortRef = inquiryId
    ? inquiryId.length > 10
      ? `AKI-${inquiryId.slice(-8).toUpperCase()}`
      : inquiryId
    : '—';

  return (
    <main className="sec a3 order-success">
      <motion.div className="order-success-icon"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        ✓
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}>
        <h2>Inquiry Sent!</h2>
        <p className="order-success-sub">
          Thank you for your interest. Our team at AK Computer Solutions will contact you
          by phone or email within 24 hours.
        </p>

        <div className="order-success-card">
          <div>
            <span>Inquiry Reference</span>
            <strong>{shortRef}</strong>
          </div>
          <div>
            <span>Response Time</span>
            <strong>Within 24 hours</strong>
          </div>
        </div>

        <div className="order-success-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/account/inquiries" className="ncall"
            style={{ textDecoration: 'none', textAlign: 'center', animation: 'none' }}>
            View My Inquiries
          </Link>
          <Link to="/" className="padd" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Continue Browsing
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

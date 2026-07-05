import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate, Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { formatPrice } from '../components/PriceBox';
import { useCart } from '../context/CartContext';
import { useInquiries } from '../context/InquiryContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useProductStore } from '../context/ProductStoreContext';

export default function InquiryFormPage() {
  const [searchParams] = useSearchParams();
  const singleProductId = searchParams.get('product');
  const { getProduct } = useProductStore();
  const singleProduct = singleProductId ? getProduct(singleProductId) : null;

  const { cartLines } = useCart();
  const { submitInquiry } = useInquiries();
  const { showToast } = useToast();
  const { isAuthenticated, user, loadingUser } = useAuth();
  const navigate = useNavigate();

  const lines = singleProduct
    ? [{ product: singleProduct, qty: 1 }]
    : cartLines;

  // Pre-fill from logged-in user profile
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || null;

  const [form, setForm] = useState({
    phone: '', email: '', message: '',
  });
  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Populate from user profile once loaded
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        phone: f.phone || user.phone || '',
        email: f.email || user.email || '',
      }));
      if (defaultAddress) {
        setAddress({
          line1: defaultAddress.line1 || '',
          line2: defaultAddress.line2 || '',
          city: defaultAddress.city || '',
          state: defaultAddress.state || '',
          pincode: defaultAddress.pincode || '',
        });
      }
    }
  }, [user, defaultAddress]);

  // While auth is loading, wait
  if (loadingUser) {
    return (
      <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--t3)' }}>
        Loading…
      </div>
    );
  }

  // Must be logged in to inquire
  if (!isAuthenticated) {
    const target = singleProductId
      ? `/inquiry?product=${singleProductId}`
      : '/inquiry';
    return <Navigate to={`/login?redirect=${encodeURIComponent(target)}`} replace />;
  }

  if (lines.length === 0) {
    return <Navigate to="/" replace />;
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setAddr = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const items = lines.map(({ product, qty }) => ({
        product: String(product.id || product._id || product.slug || ''),
        name: product.name,
        qty,
      }));
      const inquiry = await submitInquiry({
        phone: form.phone,
        email: form.email,
        message: form.message,
        items,
        address,
      });
      navigate(`/inquiry-sent/${inquiry._id || inquiry.id}`);
    } catch (err) {
      showToast(err.message || 'Failed to send inquiry. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Inquiry' }]} />
      <div className="sec-head">
        <h3 className="sec-title">Product Inquiry</h3>
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Items */}
          <section className="checkout-section">
            <h4>Products you're enquiring about</h4>
            <div className="cart-page-lines">
              {lines.map(({ product, qty }) => (
                <div className="cart-line" key={product.id || product._id}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-line-info">
                    <span className="cart-line-name">{product.name}</span>
                    <span className="pbrand">{product.brand}</span>
                    <div className="cart-line-price">{formatPrice(product.price)}</div>
                  </div>
                  <span className="payment-sub">Qty: {qty}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact details */}
          <section className="checkout-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0 }}>Your contact details</h4>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                Logged in as <strong style={{ color: 'var(--acc)' }}>{user.name}</strong>
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="checkout-form-grid">
                <div>
                  <label style={lbl}>Phone Number *</label>
                  <input type="tel" placeholder="98765 43210" value={form.phone}
                    onChange={set('phone')} required />
                </div>
                <div>
                  <label style={lbl}>Email</label>
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={set('email')} />
                </div>
              </div>

              {/* Address */}
              <h5 style={{ margin: '20px 0 12px', color: 'var(--t2)' }}>Delivery / Contact Address</h5>
              <div className="checkout-form-grid">
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Address Line 1</label>
                  <input placeholder="House / Flat No., Street, Area"
                    value={address.line1} onChange={setAddr('line1')} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Address Line 2 (optional)</label>
                  <input placeholder="Landmark, Near…"
                    value={address.line2} onChange={setAddr('line2')} />
                </div>
                <div>
                  <label style={lbl}>City</label>
                  <input placeholder="Ahmedabad" value={address.city}
                    onChange={setAddr('city')} />
                </div>
                <div>
                  <label style={lbl}>Pincode</label>
                  <input placeholder="380001" value={address.pincode}
                    onChange={setAddr('pincode')} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>State</label>
                  <input placeholder="Gujarat" value={address.state}
                    onChange={setAddr('state')} />
                </div>
              </div>

              {/* Message */}
              <div style={{ marginTop: 16 }}>
                <label style={lbl}>Additional Message (optional)</label>
                <textarea
                  placeholder="Budget, timeline, colour preference, any specific questions…"
                  value={form.message} onChange={set('message')}
                  rows={4} style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="ncall"
                style={{ marginTop: 20, animation: 'none' }} disabled={submitting}>
                {submitting ? 'Sending Inquiry…' : 'Send Inquiry →'}
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <div className="checkout-side">
          <div className="order-summary">
            <h4>How it works</h4>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7 }}>
              No payment is taken here. Once you submit, our team at AK Computer
              Solutions will call or email you to confirm pricing, availability,
              and next steps.
            </p>
            <div style={{ borderTop: '1px solid var(--b2)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {["We'll call you within 24 hours", 'Get a custom quote', 'No obligation to buy'].map((s) => (
                  <span key={s} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--grn)', fontWeight: 700 }}>✓</span>
                    <span style={{ color: 'var(--t2)' }}>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="order-summary" style={{ marginTop: 12, fontSize: 13 }}>
            <p style={{ color: 'var(--t3)' }}>
              Want to update your address for future inquiries?{' '}
              <Link to="/account/addresses" style={{ color: 'var(--acc)' }}>
                Manage addresses →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

const lbl = { fontSize: 12, color: 'var(--t2)', fontWeight: 600,
  display: 'block', marginBottom: 6 };

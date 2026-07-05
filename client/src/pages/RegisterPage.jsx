import { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

export default function RegisterPage() {
  const { register, isAuthenticated, loadingUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/account';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loadingUser && isAuthenticated) return <Navigate to={redirect} replace />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setAddr = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const hasAddress = address.line1 || address.city;
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      address: hasAddress ? address : undefined,
    });
    setLoading(false);

    if (result.ok) {
      showToast('Account created! Welcome to AK Computer Solutions.', 'success');
      navigate(redirect, { replace: true });
    } else {
      setError(result.reason);
    }
  };

  return (
    <div style={{ padding: '40px 16px', maxWidth: 560, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 6 }}>Create Account</h2>
      <p style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 24 }}>
        Already have an account?{' '}
        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}
          style={{ color: 'var(--acc)', fontWeight: 600 }}>
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit}>
        {/* Personal info */}
        <div className="checkout-section" style={{ marginBottom: 16 }}>
          <h5 style={{ marginBottom: 16, color: 'var(--t2)' }}>Personal Information</h5>
          <div className="checkout-form-grid">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input placeholder="Rahul Shah" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input type="tel" placeholder="98765 43210" value={form.phone}
                onChange={set('phone')} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={set('email')} autoComplete="email" required />
            </div>
            <div>
              <label style={labelStyle}>Password * (min. 6 characters)</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={set('password')} autoComplete="new-password" required />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input type="password" placeholder="••••••••" value={form.confirmPassword}
                onChange={set('confirmPassword')} autoComplete="new-password" required />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="checkout-section" style={{ marginBottom: 16 }}>
          <h5 style={{ marginBottom: 4, color: 'var(--t2)' }}>Delivery Address</h5>
          <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
            Optional — you can also add this later from your account.
          </p>
          <div className="checkout-form-grid">
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Address Line 1</label>
              <input placeholder="House / Flat No., Street, Area"
                value={address.line1} onChange={setAddr('line1')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Address Line 2 (optional)</label>
              <input placeholder="Landmark, Near…" value={address.line2}
                onChange={setAddr('line2')} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input placeholder="Ahmedabad" value={address.city}
                onChange={setAddr('city')} />
            </div>
            <div>
              <label style={labelStyle}>Pincode</label>
              <input placeholder="380001" value={address.pincode}
                onChange={setAddr('pincode')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>State</label>
              <select value={address.state} onChange={setAddr('state')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--b2)', background: 'var(--s2)',
                  color: 'var(--t1)', fontSize: 14 }}>
                <option value="">Select state…</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12,
            padding: '8px 12px', background: 'color-mix(in srgb,var(--red) 10%,transparent)',
            borderRadius: 6 }}>
            {error}
          </p>
        )}

        <button type="submit" className="ncall" disabled={loading}
          style={{ width: '100%', justifyContent: 'center', animation: 'none' }}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center', marginTop: 12 }}>
          By creating an account you agree to our{' '}
          <Link to="/terms" style={{ color: 'var(--acc)' }}>Terms</Link> and{' '}
          <Link to="/privacy-policy" style={{ color: 'var(--acc)' }}>Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}

const labelStyle = {
  fontSize: 12, color: 'var(--t2)', fontWeight: 600, display: 'block', marginBottom: 6,
};

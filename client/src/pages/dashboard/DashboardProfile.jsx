import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function DashboardProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(form);
    setLoading(false);
    if (result.ok) showToast('Profile updated', 'success');
    else showToast(result.reason, 'error');
  };

  return (
    <div className="dashboard-card">
      <h4>Profile Details</h4>
      <form className="checkout-form-grid" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div>
          <label style={lbl}>Full Name</label>
          <input value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full Name" required />
        </div>
        <div>
          <label style={lbl}>Phone Number</label>
          <input type="tel" value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="98765 43210" required />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Email Address</label>
          <input value={user?.email || ''} disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
            Email cannot be changed. Contact support if needed.
          </p>
        </div>
        <button type="submit" className="ncall" disabled={loading}
          style={{ animation: 'none', gridColumn: '1 / -1', justifyContent: 'center' }}>
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
      <p className="dashboard-meta" style={{ marginTop: 16, fontSize: 12, color: 'var(--t3)' }}>
        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN',
          { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
      </p>
    </div>
  );
}

const lbl = { fontSize: 12, color: 'var(--t2)', fontWeight: 600, display: 'block', marginBottom: 6 };

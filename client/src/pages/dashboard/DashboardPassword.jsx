import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/api';

export default function DashboardPassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (form.newPassword !== form.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/users/me/password', {
        method: 'PUT',
        authAs: 'customer',
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      showToast('Password updated successfully', 'success');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h4>Change Password</h4>
      <form className="checkout-form-grid" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Current Password</label>
          <input type="password" placeholder="••••••••"
            value={form.currentPassword} onChange={set('currentPassword')}
            autoComplete="current-password" required />
        </div>
        <div>
          <label style={lbl}>New Password (min. 6 chars)</label>
          <input type="password" placeholder="••••••••"
            value={form.newPassword} onChange={set('newPassword')}
            autoComplete="new-password" required />
        </div>
        <div>
          <label style={lbl}>Confirm New Password</label>
          <input type="password" placeholder="••••••••"
            value={form.confirm} onChange={set('confirm')}
            autoComplete="new-password" required />
        </div>
        <button type="submit" className="ncall" disabled={loading}
          style={{ animation: 'none', gridColumn: '1 / -1', justifyContent: 'center' }}>
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

const lbl = { fontSize: 12, color: 'var(--t2)', fontWeight: 600, display: 'block', marginBottom: 6 };

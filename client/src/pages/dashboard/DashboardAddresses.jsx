import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/api';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

const empty = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

export default function DashboardAddresses() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const openAdd = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (addr) => {
    setForm({ label: addr.label || 'Home', line1: addr.line1, line2: addr.line2 || '',
      city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setEditId(addr._id);
    setShowForm(true);
  };
  const cancelForm = () => { setShowForm(false); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (editId) {
        data = await apiFetch(`/users/me/addresses/${editId}`, {
          method: 'PUT', authAs: 'customer', body: form,
        });
      } else {
        data = await apiFetch('/users/me/addresses', {
          method: 'POST', authAs: 'customer', body: form,
        });
      }
      setAddresses(data.addresses);
      await refreshUser();
      showToast(editId ? 'Address updated' : 'Address added', 'success');
      cancelForm();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      const data = await apiFetch(`/users/me/addresses/${id}`, {
        method: 'DELETE', authAs: 'customer',
      });
      setAddresses(data.addresses);
      await refreshUser();
      showToast('Address removed', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <h4 style={{ margin: 0 }}>Saved Addresses</h4>
        {!showForm && (
          <button className="padd" onClick={openAdd}>+ Add Address</button>
        )}
      </div>

      {/* Saved addresses list */}
      {addresses.length === 0 && !showForm && (
        <p style={{ color: 'var(--t3)', fontSize: 14 }}>
          No addresses saved yet. Add one to speed up future inquiries.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: showForm ? 24 : 0 }}>
        {addresses.map((addr) => (
          <div key={addr._id} style={{ padding: '14px 16px', borderRadius: 10,
            border: `1.5px solid ${addr.isDefault ? 'var(--acc)' : 'var(--b2)'}`,
            background: 'var(--s2)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)',
                  background: 'var(--s3)', padding: '2px 8px', borderRadius: 6, marginRight: 8 }}>
                  {addr.label || 'Home'}
                </span>
                {addr.isDefault && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--acc)' }}>
                    Default
                  </span>
                )}
                <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--t1)', lineHeight: 1.6 }}>
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="fl" onClick={() => openEdit(addr)}>Edit</button>
                <button className="fl" style={{ color: 'var(--red)' }}
                  onClick={() => handleDelete(addr._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div style={{ borderTop: '1px solid var(--b2)', paddingTop: 20 }}>
          <h5 style={{ marginBottom: 16 }}>{editId ? 'Edit Address' : 'New Address'}</h5>
          <form className="checkout-form-grid" onSubmit={handleSubmit}>
            <div>
              <label style={lbl}>Label</label>
              <select value={form.label} onChange={set('label')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--b2)', background: 'var(--s2)',
                  color: 'var(--t1)', fontSize: 14 }}>
                {['Home','Office','Other'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Set as Default</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10 }}>
                <input type="checkbox" checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} />
                <span style={{ fontSize: 13 }}>Default address</span>
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Address Line 1 *</label>
              <input placeholder="House / Flat No., Street, Area"
                value={form.line1} onChange={set('line1')} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Address Line 2</label>
              <input placeholder="Landmark, Near…" value={form.line2} onChange={set('line2')} />
            </div>
            <div>
              <label style={lbl}>City *</label>
              <input placeholder="Ahmedabad" value={form.city} onChange={set('city')} required />
            </div>
            <div>
              <label style={lbl}>Pincode *</label>
              <input placeholder="380001" value={form.pincode} onChange={set('pincode')} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>State *</label>
              <select value={form.state} onChange={set('state')} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--b2)', background: 'var(--s2)',
                  color: 'var(--t1)', fontSize: 14 }}>
                <option value="">Select state…</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
              <button type="submit" className="ncall" disabled={loading}
                style={{ animation: 'none' }}>
                {loading ? 'Saving…' : editId ? 'Update Address' : 'Save Address'}
              </button>
              <button type="button" className="padd" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const lbl = { fontSize: 12, color: 'var(--t2)', fontWeight: 600, display: 'block', marginBottom: 6 };

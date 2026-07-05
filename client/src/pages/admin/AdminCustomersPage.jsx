import { useEffect, useMemo, useState } from 'react';
import { useInquiries } from '../../context/InquiryContext';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState('');
  const { inquiries, loadAdminInquiries } = useInquiries();

  useEffect(() => {
    apiFetch('/users', { authAs: 'admin' })
      .then((data) => setCustomers(data.customers || data.users || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  // InquiryContext only auto-loads admin inquiries if an admin token already
  // existed when the app first mounted, so a page opened directly (or after
  // logging in without a full reload) never populates `inquiries`. Explicitly
  // trigger the load here too, same as AdminDashboardPage/AdminInquiriesPage do.
  useEffect(() => {
    loadAdminInquiries();
  }, [loadAdminInquiries]);

  // Build inquiry count map
  const countMap = useMemo(() => {
    const m = new Map();
    inquiries.forEach((inq) => {
      const key = inq.customer?._id || inq.customer;
      if (key) m.set(key, (m.get(key) || 0) + 1);
    });
    return m;
  }, [inquiries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-t1 tracking-tight">Customers</h2>
        <p className="text-sm text-t3 mt-1">All registered customers from the database.</p>
      </div>

      <input
        className="w-full max-w-sm px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors"
        placeholder="Search by name, email, or phone…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="bg-s2 border border-b1 rounded-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-b1">
              {['Name','Email','Phone','Joined','Inquiries'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-t3 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-t3">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-t3">No customers found.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c._id} className="border-b border-b1 last:border-0 hover:bg-s1 transition-colors">
                <td className="px-5 py-3 text-t1 font-semibold">{c.name}</td>
                <td className="px-5 py-3 text-t2">{c.email}</td>
                <td className="px-5 py-3 text-t2">{c.phone || '—'}</td>
                <td className="px-5 py-3 text-t3 text-xs whitespace-nowrap">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-5 py-3">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-acc/10 text-acc">
                    {countMap.get(c._id) || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

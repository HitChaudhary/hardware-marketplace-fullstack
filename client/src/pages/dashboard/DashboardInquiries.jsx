import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInquiries } from '../../context/InquiryContext';

const STATUS_COLORS = {
  new: 'var(--acc)',
  contacted: 'var(--amb)',
  'in-progress': 'var(--pur)',
  closed: 'var(--grn)',
  cancelled: 'var(--red)',
};

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  'in-progress': 'In Progress',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

export default function DashboardInquiries() {
  const { myInquiries, loadMyInquiries } = useInquiries();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyInquiries().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="dashboard-card">
        <p style={{ color: 'var(--t3)', fontSize: 14 }}>Loading inquiries…</p>
      </div>
    );
  }

  if (myInquiries.length === 0) {
    return (
      <div className="dashboard-card">
        <h4 style={{ marginBottom: 8 }}>My Inquiries</h4>
        <p style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 16 }}>
          You haven't submitted any inquiries yet.
        </p>
        <Link to="/" className="ncall" style={{ textDecoration: 'none',
          display: 'inline-flex', animation: 'none' }}>
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h4 style={{ marginBottom: 20 }}>My Inquiries ({myInquiries.length})</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {myInquiries.map((inq) => (
          <div key={inq._id || inq.id} style={{
            padding: '16px', borderRadius: 10,
            border: '1px solid var(--b2)', background: 'var(--s2)',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)',
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Ref: AKI-{(inq._id || inq.id || '').slice(-8).toUpperCase()}
                </span>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--t3)' }}>
                  {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '3px 10px',
                borderRadius: 999, color: '#fff',
                background: STATUS_COLORS[inq.status] || 'var(--t3)',
              }}>
                {STATUS_LABELS[inq.status] || inq.status}
              </span>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(inq.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center',
                  gap: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--t3)' }}>×{item.qty}</span>
                  <span style={{ color: 'var(--t1)', fontWeight: 500 }}>{item.name}</span>
                </div>
              ))}
            </div>

            {/* Message */}
            {inq.message && (
              <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 10,
                padding: '8px 10px', background: 'var(--s3)', borderRadius: 6,
                fontStyle: 'italic' }}>
                "{inq.message}"
              </p>
            )}

            {/* Status info */}
            {inq.status === 'new' && (
              <p style={{ fontSize: 12, color: 'var(--acc)', marginTop: 10 }}>
                ⏳ We'll reach out within 24 hours.
              </p>
            )}
            {inq.status === 'contacted' && (
              <p style={{ fontSize: 12, color: 'var(--amb)', marginTop: 10 }}>
                📞 Our team has been in touch. Reply to us to continue.
              </p>
            )}
            {inq.status === 'closed' && (
              <p style={{ fontSize: 12, color: 'var(--grn)', marginTop: 10 }}>
                ✓ This inquiry has been resolved.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

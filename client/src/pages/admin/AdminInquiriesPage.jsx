import { useEffect, useState } from 'react';
import { useInquiries } from '../../context/InquiryContext';

const STATUSES = ['all', 'new', 'contacted', 'closed'];

function badgeClass(status) {
  if (status === 'new')       return 'bg-amb/20 text-amb';
  if (status === 'contacted') return 'bg-grn/20 text-grn';
  return 'bg-t3/20 text-t3';
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const NEXT = { new: 'contacted', contacted: 'closed', closed: 'new' };

export default function AdminInquiriesPage() {
  const { inquiries, updateStatus, removeInquiry, loadAdminInquiries } = useInquiries();
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadAdminInquiries(); }, [loadAdminInquiries]);

  const visible = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-t1 tracking-tight">Inquiries</h2>
        <p className="text-sm text-t3 mt-1">Customer leads submitted through the inquiry form.</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize cursor-pointer border transition-all
              ${filter === s ? 'bg-acc-g text-white border-transparent' : 'bg-s2 border-b2 text-t2 hover:border-b3'}`}>
            {s === 'all' ? 'All' : s}
            {s !== 'all' && ` (${inquiries.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-s2 border border-b1 rounded-card shadow-card py-16 text-center text-t3">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-sm font-medium">No inquiries here yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((inq) => (
            <div key={inq._id || inq.id} className="bg-s2 border border-b1 rounded-card shadow-card p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="text-sm font-bold text-t1">{inq.contactName || inq.name}</p>
                  <p className="text-xs text-t3 mt-0.5">
                    {inq.contactPhone || inq.phone}
                    {(inq.contactEmail || inq.email) && ` · ${inq.contactEmail || inq.email}`}
                  </p>
                  <p className="text-xs text-t3">{fmtDate(inq.createdAt)}</p>
                </div>
                <button onClick={() => updateStatus(inq._id || inq.id, NEXT[inq.status])}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize cursor-pointer border transition-all ${badgeClass(inq.status)}`}>
                  {inq.status} ↻
                </button>
              </div>

              {inq.contactAddress && (
                <p className="text-xs text-t3 mb-2">📍 {inq.contactAddress}</p>
              )}
              {inq.message && (
                <p className="text-sm text-t2 italic mb-3">"{inq.message}"</p>
              )}

              <div className="space-y-1 mb-3">
                {(inq.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-t2">{item.name}</span>
                    <span className="text-t3 text-xs">× {item.qty}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => removeInquiry(inq._id || inq.id)}
                className="text-xs text-t3 hover:text-red cursor-pointer transition-colors bg-none border-none">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

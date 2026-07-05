import { useState } from 'react';
import { useBuildOptionsStore } from '../../context/BuildOptionsStoreContext';
import { formatPrice } from '../../components/PriceBox';

const CATEGORY_LABELS = {
  cpu: 'Processor', motherboard: 'Motherboard', ram: 'RAM', gpu: 'Graphics Card',
  storage: 'Storage', cabinet: 'Cabinet', psu: 'Power Supply', cooler: 'Cooler',
};
const SOCKET_CATS = ['cpu', 'motherboard'];
const emptyForm = () => ({ name: '', price: '', socket: '' });

const inputCls = "w-full px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors";

export default function AdminBuildOptionsPage() {
  const { buildOptions, buildSteps, addOption, updateOption, deleteOption } = useBuildOptionsStore();
  const [cat, setCat]           = useState(buildSteps[0].key);
  const [form, setForm]         = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showSocket = SOCKET_CATS.includes(cat);
  const items = buildOptions[cat] || [];

  const switchCat = (key) => { setCat(key); setForm(emptyForm()); setEditingId(null); setConfirmId(null); };
  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));
  const startEdit = (opt) => { setEditingId(opt.id); setForm({ name: opt.name, price: opt.price, socket: opt.socket || '' }); };
  const cancelEdit = () => { setEditingId(null); setForm(emptyForm()); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === '') return;
    if (editingId) { updateOption(cat, editingId, form); setEditingId(null); }
    else addOption(cat, form);
    setForm(emptyForm());
  };

  const handleDelete = (id) => {
    if (confirmId === id) { deleteOption(cat, id); setConfirmId(null); if (editingId === id) cancelEdit(); }
    else setConfirmId(id);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-t1 tracking-tight">Build PC Parts</h2>
        <p className="text-sm text-t3 mt-1">Manage component options customers see on the Build Your PC page.</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {buildSteps.map((s) => (
          <button key={s.key} onClick={() => switchCat(s.key)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all
              ${cat === s.key ? 'bg-acc-g text-white border-transparent' : 'bg-s2 border-b2 text-t2 hover:border-b3'}`}>
            {CATEGORY_LABELS[s.key] || s.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cat === s.key ? 'bg-white/20 text-white' : 'bg-s1 text-t3'}`}>
              {(buildOptions[s.key] || []).length}
            </span>
          </button>
        ))}
      </div>

      {/* Add / edit form */}
      <div className="bg-s2 border border-b1 rounded-card shadow-card p-5">
        <h4 className="text-sm font-bold text-t1 mb-4">
          {editingId ? `Edit ${CATEGORY_LABELS[cat]} Option` : `Add ${CATEGORY_LABELS[cat]} Option`}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={showSocket ? inputCls : `${inputCls} sm:col-span-2`}
              placeholder="Component Name" value={form.name} onChange={set('name')} required />
            <input className={inputCls} placeholder="Price (₹)" type="number" min="0" value={form.price} onChange={set('price')} required />
            {showSocket && <input className={inputCls} placeholder="Socket (e.g. LGA1700, AM5)" value={form.socket} onChange={set('socket')} />}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-acc-g text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
              {editingId ? 'Save Changes' : 'Add Option'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit}
                className="px-4 py-2 rounded-lg bg-s1 border border-b2 text-t1 text-sm font-semibold hover:border-b3 transition-colors cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Options table */}
      <div className="bg-s2 border border-b1 rounded-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-b1">
              <th className="text-left px-5 py-3 text-xs font-semibold text-t3 uppercase tracking-wider">Name</th>
              {showSocket && <th className="text-left px-5 py-3 text-xs font-semibold text-t3 uppercase tracking-wider">Socket</th>}
              <th className="text-left px-5 py-3 text-xs font-semibold text-t3 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={showSocket ? 4 : 3} className="px-5 py-10 text-center text-t3">No options yet — add one above.</td></tr>
            ) : items.map((opt) => (
              <tr key={opt.id} className="border-b border-b1 last:border-0 hover:bg-s1 transition-colors">
                <td className="px-5 py-3 text-t1 font-medium">{opt.name}</td>
                {showSocket && <td className="px-5 py-3 text-t2">{opt.socket || '—'}</td>}
                <td className="px-5 py-3 text-t1 font-semibold whitespace-nowrap">{formatPrice(opt.price)}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => startEdit(opt)}
                      className="px-3 py-1.5 rounded-lg bg-s1 border border-b2 text-t2 text-xs font-semibold hover:text-t1 hover:bg-s2 cursor-pointer transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(opt.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors
                        ${confirmId === opt.id ? 'bg-red/10 border-red text-red' : 'bg-s1 border-b2 text-t2 hover:border-red hover:text-red'}`}>
                      {confirmId === opt.id ? 'Confirm?' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

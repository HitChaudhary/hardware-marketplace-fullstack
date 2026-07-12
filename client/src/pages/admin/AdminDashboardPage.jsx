import { Link } from 'react-router-dom';
import { useProductStore } from '../../context/ProductStoreContext';

const QUICK_LINKS = [
  { to: '/admin/products/new', label: '+ Add Product', primary: true },
  { to: '/admin/products',     label: '📦 Manage Products' },
];

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-s2 border border-b1 rounded-card shadow-card p-4 sm:p-5">
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-t3 mb-1 sm:mb-2 truncate" style={accent ? { color: accent } : {}}>
        {icon} <span className="ml-1">{label}</span>
      </p>
      <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-t1">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { products, getStock } = useProductStore();

  const inStock  = products.filter((p) => getStock(p) === 'in').length;
  const lowStock = products.filter((p) => getStock(p) === 'low').length;
  const outStock = products.filter((p) => getStock(p) === 'out').length;

  const healthBars = [
    { label: 'In Stock',     count: inStock,  color: 'var(--grn)' },
    { label: 'Low Stock',    count: lowStock, color: 'var(--amb)' },
    { label: 'Out of Stock', count: outStock, color: 'var(--red)' },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-0">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-t1 tracking-tight">Dashboard</h2>
          <p className="text-xs sm:text-sm text-t3 mt-0.5">Overview of your product catalog and stock.</p>
        </div>
        <Link to="/admin/products/new"
          className="no-underline inline-block text-center px-4 py-2.5 rounded-lg bg-acc-g text-white text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto">
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon="📦" label="Products"     value={products.length} />
        <StatCard icon="✅" label="In Stock"     value={inStock}  accent="var(--grn)" />
        <StatCard icon="⚠️" label="Low Stock"    value={lowStock} accent="var(--amb)" />
        <StatCard icon="⛔" label="Out of Stock" value={outStock} accent="var(--red)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-s2 border border-b1 rounded-card shadow-card p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-t1 mb-4 uppercase tracking-wide">Quick Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {QUICK_LINKS.map(({ to, label, primary }) => (
                <Link key={to} to={to}
                  className={`no-underline text-center py-2.5 rounded-lg text-sm font-semibold transition-all block
                    ${primary
                      ? 'bg-acc-g text-white hover:opacity-90'
                      : 'bg-s1 border border-b2 text-t1 hover:border-b3'}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-s2 border border-b1 rounded-card shadow-card p-4 sm:p-5">
          <h4 className="text-xs sm:text-sm font-bold text-t1 mb-4 uppercase tracking-wide">Stock Health</h4>
          <div className="flex flex-col gap-4">
            {healthBars.map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-t3 w-20 sm:w-24 shrink-0 truncate">{label}</span>
                <div className="flex-1 bg-b1 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: products.length ? `${(count / products.length) * 100}%` : '0%', background: color, minWidth: count ? 4 : 0 }} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-t1 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

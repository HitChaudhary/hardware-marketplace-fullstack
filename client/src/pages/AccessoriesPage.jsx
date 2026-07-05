import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ProductGrid from '../components/ProductGrid';
import { useProductStore } from '../context/ProductStoreContext';

const GROUPS = [
  { title: 'Keyboard, Mouse & Headphones', icon: '⌨️', category: 'keyboards-mice-headphones' },
  { title: 'RAM & Storage (incl. SSD)', icon: '💾', category: 'ram-storage' },
  { title: 'Monitors', icon: '🖼️', category: 'monitors-screens' },
  { title: 'Printers', icon: '🖨️', category: 'printers-cartridges' },
  { title: 'Cables & Networking', icon: '🔌', category: 'cables-accessories' },
];

export default function AccessoriesPage() {
  const { products, loading } = useProductStore();
  const getProductsByCategory = (cat) => products.filter((p) => p.category === cat);

  if (loading) return <main className="sec a3"><p>Loading…</p></main>;

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Accessories' }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">Accessories</h3>
          <div className="sec-sub">Everything to complete your setup</div>
        </div>
      </div>

      {GROUPS.map((g) => {
        const items = getProductsByCategory(g.category).slice(0, 4);
        return (
          <div key={g.category} style={{ marginBottom: 36 }}>
            <div className="sec-head">
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{g.icon} {g.title}</h4>
              <Link to={`/category/${g.category}`} className="fl">View All →</Link>
            </div>
            <ProductGrid products={items} />
          </div>
        );
      })}
    </main>
  );
}

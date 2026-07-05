import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../context/ProductStoreContext';
import { formatPrice } from '../../components/PriceBox';

function stockBadge(stock) {
  if (stock === 'in')  return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-grn/20 text-grn">In Stock</span>;
  if (stock === 'low') return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amb/20 text-amb">Low Stock</span>;
  return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red/20 text-red">Out of Stock</span>;
}

export default function AdminProductsPage() {
  const { products, getStock, deleteProduct } = useProductStore();
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) || 
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [products, query]);

  // MongoDB uses _id as the unique key fallback identifier
  const handleDelete = (productId) => {
    if (confirmId === productId) { 
      deleteProduct(productId); 
      setConfirmId(null); 
    } else {
      setConfirmId(productId);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-t1 tracking-tight">Products</h2>
          <p className="text-sm text-t3 mt-1">Add, edit, and manage stock across the catalog.</p>
        </div>
        <Link to="/admin/products/new"
          className="no-underline px-4 py-2.5 rounded-lg bg-acc-g text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          + Add Product
        </Link>
      </div>

      <input
        className="w-full max-w-sm px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors"
        placeholder="Search by name, brand, category…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="bg-s2 border border-b1 rounded-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-b1">
              {['','Name','Brand','Category','Price','Stock',''].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-t3 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-t3">No products found.</td></tr>
            ) : filtered.map((p) => {
              // Extract the target key safely prioritizing MongoDB signature schemas
              const productId = p._id || p.id;
              
              return (
                <tr key={productId} className="border-b border-b1 last:border-0 hover:bg-s1 transition-colors">
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-white" />
                  </td>
                  <td className="px-4 py-3 text-t1 font-medium max-w-[200px] truncate" title={p.name}>
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-t2">{p.brand}</td>
                  <td className="px-4 py-3 text-t2 capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-t1 font-semibold whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{stockBadge(getStock(p))}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${productId}/edit`}
                        className="no-underline px-3 py-1.5 rounded-lg bg-s1 border border-b2 text-t2 text-xs font-semibold hover:bg-s2 hover:text-t1 transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(productId)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors
                          ${confirmId === productId
                            ? 'bg-red-500/10 border-red-500 text-red-500'
                            : 'bg-s1 border-b2 text-t2 hover:border-red-500 hover:text-red-500'}`}>
                        {confirmId === productId ? 'Confirm?' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
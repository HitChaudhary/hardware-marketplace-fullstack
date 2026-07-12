import Breadcrumb from '../components/Breadcrumb';
import CompareTable from '../components/CompareTable';
import EmptyState from '../components/EmptyState';
import { useCompare } from '../context/CompareContext';

export default function ComparePage() {
  const { compareProducts, removeFromCompare, clearCompare, MAX_COMPARE } = useCompare();

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Compare' }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">Compare Products</h3>
          <div className="sec-sub">Comparing {compareProducts.length} of {MAX_COMPARE} products</div>
        </div>
        {compareProducts.length > 0 && (
          <button className="fl" onClick={clearCompare} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear all
          </button>
        )}
      </div>

      {compareProducts.length === 0 ? (
        <EmptyState
          icon="⇄"
          title="No products to compare"
          message="Add products to compare from their product cards."
          actionLabel="Browse Products"
          actionTo="/"
        />
      ) : (
        <CompareTable products={compareProducts} onRemove={removeFromCompare} />
      )}
    </main>
  );
}

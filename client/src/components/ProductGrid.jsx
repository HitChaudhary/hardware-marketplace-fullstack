import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

export default function ProductGrid({ products, view = 'grid', emptyMessage }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="🗂️"
        message={emptyMessage || 'No products in this category yet. Check back soon.'}
      />
    );
  }

  return (
    <div className={`pgrid ${view === 'list' ? 'list-view' : ''}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

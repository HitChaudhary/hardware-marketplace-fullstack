import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import FilterSidebar, { defaultFilters } from '../components/FilterSidebar';
import ProductToolbar from '../components/ProductToolbar';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import { SkeletonGrid } from '../components/LoadingSkeleton';
import { getCategoryBySlug } from '../data/categories';
import { useProductStore } from '../context/ProductStoreContext'; // Using your updated MongoDB context store
import { getRating, getStock } from '../utils/productMeta';
import { sortProducts } from '../components/SortDropdown';

const PAGE_SIZE = 8;

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  
  // Connect cleanly to your real live database state manager
  const { products, getStock: getContextStock, loading: storeLoading } = useProductStore();

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  // 1. Dynamic Filtering: Extract category items directly from the global MongoDB product stream
  const items = useMemo(() => {
    if (storeLoading || !products) return [];
    return products.filter((p) => p.category === slug);
  }, [products, slug, storeLoading]);

  // Derive unique dynamic parameters natively from the actual matching database records
  const brandOptions = useMemo(() => {
    const uniqueBrands = [...new Set(items.map((p) => p.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [items]);

  const maxPrice = useMemo(() => {
    if (items.length === 0) return 1000;
    const prices = items.map((p) => p.price).filter((p) => !isNaN(p));
    return prices.length > 0 ? Math.max(...prices, 1000) : 1000;
  }, [items]);

  // 2. State Hydration synchronization: Reset sliders on slug changes or when global data arrives
  useEffect(() => {
    if (storeLoading) return;
    setLoading(true);
    setFilters(defaultFilters(maxPrice));
    setPage(1);
    
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [slug, maxPrice, storeLoading]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  // Handle case where state filters aren't initialized yet during layout switches
  const currentFilters = filters || defaultFilters(maxPrice);

  // 3. Complete memory calculation for search parameters and criteria sorting chains
  const filtered = (() => {
    let list = [...items];
    
    // Price Boundary cap evaluations
    list = list.filter((p) => p.price <= currentFilters.priceMax);
    
    // Brand category selection constraints
    if (currentFilters.brands?.length) {
      list = list.filter((p) => currentFilters.brands.includes(p.brand));
    }
    
    // Availability visibility filters
    if (currentFilters.inStockOnly) {
      list = list.filter((p) => getContextStock(p) !== 'out' && getStock(p) !== 'out');
    }
    
    // Rating star filter blocks
    if (currentFilters.minRating > 0) {
      list = list.filter((p) => getRating(p) >= currentFilters.minRating);
    }
    
    list = list.map((p) => ({ ...p, _rating: getRating(p) }));
    return sortProducts(list, sortBy);
  })();

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: category.name }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">{category.name}</h3>
          <div className="sec-sub">{category.description}</div>
        </div>
      </div>

      {storeLoading || loading || !filters ? (
        <SkeletonGrid count={8} />
      ) : (
        <div className="listing-layout">
          <FilterSidebar
            brandOptions={brandOptions}
            maxPrice={maxPrice}
            filters={currentFilters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            onReset={() => { setFormFilters(defaultFilters(maxPrice)); setPage(1); }}
          />
          <div className="listing-main">
            <ProductToolbar
              count={filtered.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              view={view}
              onViewChange={setView}
            />
            <ProductGrid products={pageItems} view={view} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      )}
    </main>
  );
}
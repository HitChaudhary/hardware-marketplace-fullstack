import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import SearchBar from '../components/SearchBar';
import FilterSidebar, { defaultFilters } from '../components/FilterSidebar';
import ProductToolbar from '../components/ProductToolbar';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/LoadingSkeleton';
import { useProductStore } from '../context/ProductStoreContext'; // Using your updated MongoDB store context
import { getRating, getStock } from '../utils/productMeta';
import { sortProducts } from '../components/SortDropdown';

const PAGE_SIZE = 8;

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();

  // Connect cleanly to your real live backend data stream
  const { products, getStock: getContextStock, loading: storeLoading } = useProductStore();

  // 1. Dynamic Matching: Search across real database fields in client memory
  const matches = useMemo(() => {
    if (!q || storeLoading || !products) return [];
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [q, products, storeLoading]);

  // Derive unique structural properties dynamically from matches
  const brandOptions = useMemo(() => {
    const uniqueBrands = [...new Set(matches.map((p) => p.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [matches]);

  const maxPrice = useMemo(() => {
    if (matches.length === 0) return 1000;
    const prices = matches.map((p) => p.price).filter((p) => !isNaN(p));
    return prices.length > 0 ? Math.max(...prices, 1000) : 1000;
  }, [matches]);

  // Local filtering states
  const [filters, setFilters] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  // 2. State Sync Effect: Reset filter bounds whenever search query strings or boundaries update
  useEffect(() => {
    if (storeLoading) return;
    setFilters(defaultFilters(maxPrice));
    setPage(1);
  }, [q, maxPrice, storeLoading]);

  // Handle active sub-filtering parameters inside memo blocks safely
  const filtered = useMemo(() => {
    if (!filters) return [];
    let list = [...matches];
    
    list = list.filter((p) => p.price <= filters.priceMax);
    
    if (filters.brands?.length) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    
    if (filters.inStockOnly) {
      list = list.filter((p) => getContextStock(p) !== 'out' && getStock(p) !== 'out');
    }
    
    if (filters.minRating > 0) {
      list = list.filter((p) => getRating(p) >= filters.minRating);
    }
    
    list = list.map((p) => ({ ...p, _rating: getRating(p) }));
    return sortProducts(list, sortBy);
  }, [matches, filters, sortBy, getContextStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Fallback state mapping values
  const currentFilters = filters || defaultFilters(maxPrice);

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Search Results' }]} />
      <div className="sec-head">
        <h3 className="sec-title">{q ? `Results for "${q}"` : 'Search'}</h3>
      </div>

      <div style={{ marginBottom: 24 }}>
        <SearchBar initialValue={q} />
      </div>

      {!q ? (
        <EmptyState icon="🔎" message="Type something above to search our catalog." />
      ) : storeLoading || !filters ? (
        // 3. Render modern loading skeletons during network calls instead of clean blank screens
        <SkeletonGrid count={8} />
      ) : matches.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="No results found"
          message={`We couldn't find anything for "${q}". Try a different keyword.`}
          actionLabel="Browse All Products"
          actionTo="/"
        />
      ) : (
        <div className="listing-layout">
          <FilterSidebar
            brandOptions={brandOptions}
            maxPrice={maxPrice}
            filters={currentFilters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            onReset={() => { setFilters(defaultFilters(maxPrice)); setPage(1); }}
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
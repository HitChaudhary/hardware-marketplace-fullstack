import SortDropdown from './SortDropdown';

export default function ProductToolbar({ count, sortBy, onSortChange, view, onViewChange }) {
  return (
    <div className="product-toolbar">
      <span className="product-toolbar-count">{count} {count === 1 ? 'product' : 'products'}</span>
      <div className="product-toolbar-actions">
        <SortDropdown value={sortBy} onChange={onSortChange} />
        <div className="view-toggle">
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
          >
            ▦
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => onViewChange('list')}
            aria-label="List view"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
}

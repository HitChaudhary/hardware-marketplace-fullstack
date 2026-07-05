export default function FilterSidebar({ brandOptions = [], maxPrice = 200000, filters, onChange, onReset }) {
  const { priceMax, brands, inStockOnly, minRating } = filters;

  const toggleBrand = (brand) => {
    const next = brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand];
    onChange({ ...filters, brands: next });
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar-head">
        <h4>Filters</h4>
        <button onClick={onReset} className="filter-reset">
          Reset
        </button>
      </div>

      <div className="filter-group">
        <h5>Price</h5>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
        />
        <div className="filter-price-label">Up to ₹{priceMax.toLocaleString('en-IN')}</div>
      </div>

      {brandOptions.length > 0 && (
        <div className="filter-group">
          <h5>Brand</h5>
          {brandOptions.map((brand) => (
            <label className="filter-check" key={brand}>
              <input
                type="checkbox"
                checked={brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      )}

      <div className="filter-group">
        <h5>Availability</h5>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
          />
          In stock only
        </label>
      </div>

      <div className="filter-group">
        <h5>Rating</h5>
        {[4, 3, 2].map((r) => (
          <label className="filter-check" key={r}>
            <input
              type="radio"
              name="minRating"
              checked={minRating === r}
              onChange={() => onChange({ ...filters, minRating: r })}
            />
            {r}★ & above
          </label>
        ))}
        <label className="filter-check">
          <input
            type="radio"
            name="minRating"
            checked={minRating === 0}
            onChange={() => onChange({ ...filters, minRating: 0 })}
          />
          All ratings
        </label>
      </div>
    </div>
  );
}

export const defaultFilters = (maxPrice = 200000) => ({
  priceMax: maxPrice,
  brands: [],
  inStockOnly: false,
  minRating: 0,
});

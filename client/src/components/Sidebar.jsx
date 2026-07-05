import { NavLink, useLocation } from 'react-router-dom';
import { categories } from '../data/categories';
import { brands } from '../data/brands';
import { useDrawer } from '../context/DrawerContext';
import "../index.css";

const PRICE_FILTERS = [
  { label: 'Under ₹20,000', query: 'maxPrice=20000' },
  { label: '₹20k - ₹40k', query: 'minPrice=20000&maxPrice=40000' },
  { label: '₹40k - ₹70k', query: 'minPrice=40000&maxPrice=70000' },
  { label: 'Above ₹70,000', query: 'minPrice=70000' },
];

export default function Sidebar() {
  const { activeDrawer, closeAll } = useDrawer();
  const location = useLocation();

  // Helper utility to make price filter query paths contextual
  const getFilterPath = (filterQuery) => {
    // Keeps the category or brand route intact while appending the price filter query parameters
    const basePath = location.pathname === '/' ? '' : location.pathname;
    return `${basePath}?${filterQuery}`;
  };

  return (
    <aside className={`sidebar-left ${activeDrawer === 'left' ? 'open' : ''}`}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          width: '100%',
        }}
      >
        <h3 className="sb-title" style={{ margin: 0 }}>
          Navigation
        </h3>
        <button
          className="mob-toggle"
          style={{
            border: 'none',
            background: 'none',
            fontSize: 22,
            width: 'auto',
            height: 'auto',
            boxShadow: 'none',
            color: 'var(--t1)',
          }}
          onClick={closeAll}
        >
          &times;
        </button>
      </div>

      <div>
        <h3 className="sb-title">Quick Links</h3>
        <NavLink to="/deals" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
          🔥 Today's Deals
        </NavLink>
        <NavLink to="/accessories" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
          🎧 Accessories
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
          🔧 Services
        </NavLink>
      </div>

      <div>
        <h3 className="sb-title">Categories</h3>
        <NavLink
          // Forcing both the pathname to home AND explicitly wiping out any search query filters
          to={{ pathname: "/", search: "" }}
          end
          className={({ isActive }) => `sb-link ${isActive && !location.search ? 'active' : ''}`}
          onClick={closeAll}
        >
          All Products
        </NavLink>

        {categories.map((cat) => (
          <NavLink
            key={cat.slug}
            // Passing an explicit empty search template string ensures clicking a different category strips out old price filters
            to={{ pathname: `/category/${cat.slug}`, search: "" }}
            className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
            onClick={closeAll}
          >
            {cat.name}
          </NavLink>
        ))}
      </div>

      <div>
        <h3 className="sb-title">Shop by Brand</h3>
        {brands.slice(0, 10).map((b) => (
          <NavLink
            key={b.slug}
            // Passing an explicit empty search template string strips out any leftover price parameters
            to={{ pathname: `/brand/${b.slug}`, search: "" }}
            className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
            onClick={closeAll}
          >
            {b.name}
          </NavLink>
        ))}
      </div>

      
    </aside>
  );
}
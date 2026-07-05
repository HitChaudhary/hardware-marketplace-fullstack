import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { openLeft, openCart, openConfig } = useDrawer();
  const { itemCount } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <button className="mob-toggle" onClick={openLeft}>☰</button>

      <Link className="logo" to="/">
        <img src={logo} alt="AK Computer Solutions" />
      </Link>

      <form className="nsearch" onSubmit={handleSearch}>
        <input type="text" placeholder="Search laptops, GPUs, RAM, SSD…"
          value={query} onChange={(e) => setQuery(e.target.value)} />
      </form>

      <div className="nav-actions">
        <button className="nact theme-toggle" title="Toggle Theme" onClick={toggleTheme}>🌓</button>
        <Link className="nact" title="Wishlist" to="/wishlist">
          ♡{wishlistIds.length > 0 && <span className="nbadge">{wishlistIds.length}</span>}
        </Link>
        <button className="nact" title="PC Configurator" onClick={openConfig}>🛠️</button>
        <button className="nact" title="Cart" onClick={openCart}>
          🛒{itemCount > 0 && <span className="nbadge">{itemCount}</span>}
        </button>

        {isAuthenticated ? (
          <>
            <Link className="nact" title={`Hi, ${user?.name?.split(' ')[0]}`} to="/account">
              👤
            </Link>
            <button className="padd nav-signout" onClick={handleLogout} title="Sign out">
              <span className="nav-action-label" style={{ fontSize: 13 }}>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link className="nact" title="Sign in" to="/login">👤</Link>
            <button className="ncall nav-signup" onClick={() => navigate('/register')}>
              <span className="nav-action-label">Sign Up</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

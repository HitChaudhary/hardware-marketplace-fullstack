import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, SunMoon, GitCompare } from 'lucide-react';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { useCompare } from '../context/CompareContext';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { openLeft } = useDrawer();
  const { ids: compareIds } = useCompare();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="nav">
      <button className="mob-toggle" onClick={openLeft} aria-label="Open menu">
        <Menu size={22} strokeWidth={2} />
      </button>

      <Link className="logo" to="/">
        <img src={logo} alt="AK Computer Solutions" />
      </Link>

      <form className="nsearch" onSubmit={handleSearch}>
        <input type="text" placeholder="Search laptops, GPUs, RAM, SSD…"
          value={query} onChange={(e) => setQuery(e.target.value)} />
      </form>

      <div className="nav-actions">
        <button className="nact theme-toggle" title="Toggle Theme" onClick={toggleTheme} aria-label="Toggle theme">
          <SunMoon size={19} strokeWidth={2} />
        </button>
        <Link className="nact" title="Compare" to="/compare" aria-label="Compare products">
          <GitCompare size={19} strokeWidth={2} />
          {compareIds.length > 0 && <span className="nbadge">{compareIds.length}</span>}
        </Link>
      </div>
    </header>
  );
}

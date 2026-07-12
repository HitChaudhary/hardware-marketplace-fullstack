import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { to: '/admin',             label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products',    label: 'Products',  icon: '📦' },
];

export default function AdminLayout() {
  const { adminLogout, admin } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // State to manage mobile sidebar opening/closing
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => { 
    adminLogout(); 
    navigate('/admin/login'); 
  };

  return (
    <div className="min-h-screen bg-bg text-t2 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 h-[72px] bg-s2 border-b border-b2 flex items-center gap-3 sm:gap-4 px-4 sm:px-6">
        
        {/* Mobile Sidebar Hamburger Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl p-1.5 rounded-lg hover:bg-s1 border border-transparent active:border-b2 md:hidden"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <a href="/admin" className="flex items-center h-full py-1 shrink-0">
          <img src={logo} alt="AK Computer Solutions" className="h-9 sm:h-10 w-auto object-contain" />
        </a>
        
        <span className="text-[10px] font-bold tracking-widest uppercase bg-acc-g text-white px-2.5 py-1 rounded-full whitespace-nowrap">
          Admin
        </span>
        
        <div className="flex-1" />
        
        {/* Actions Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={toggleTheme} 
            className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-lg bg-s1 border border-b2 text-t1 flex items-center justify-center text-base cursor-pointer hover:bg-s2 transition-colors" 
            title="Toggle theme"
          >
            🌓
          </button>
          
          <span className="text-sm text-t3 hidden sm:block font-medium">
            Hi, {admin?.name?.split(' ')[0] || 'Admin'}
          </span>
          
          <button 
            onClick={handleLogout} 
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-s1 border border-b2 text-t1 text-xs sm:text-sm font-semibold cursor-pointer hover:border-b3 transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative min-h-0">
        
        {/* Backdrop Tint overlay for mobile view when sidebar pulls forward */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Container - Sliding overlay on mobile, fixed element on desktop */}
        <aside className={`
          fixed top-[72px] bottom-0 left-0 w-[240px] bg-s1 border-r border-b1 flex flex-col gap-1 p-3 z-50 transition-transform duration-300 ease-in-out
          md:sticky md:top-[72px] md:h-[calc(100vh-72px)] md:translate-x-0 shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 flex-1">
            {TABS.map((t) => (
              <NavLink 
                key={t.to} 
                to={t.to} 
                end={t.end}
                onClick={() => setIsSidebarOpen(false)} // Auto close menu when a drawer tab is selected
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all no-underline
                  ${isActive ? 'bg-acc-g text-white shadow-md font-semibold' : 'text-t2 hover:bg-s2 hover:text-t1'}
                `}
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer Navigation Link */}
          <div className="mt-auto pt-3 border-t border-b1">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-t3 hover:text-t1 hover:bg-s2 no-underline transition-colors"
            >
              <span className="text-base">🏬</span>
              <span>View Store</span>
            </a>
          </div>
        </aside>

        {/* Responsive Central Content Shell */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-16">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
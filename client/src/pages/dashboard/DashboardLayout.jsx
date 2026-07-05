import { NavLink, Outlet, Navigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { to: '/account', label: '👤 Profile', end: true },
  { to: '/account/addresses', label: '📍 Addresses' },
  { to: '/account/inquiries', label: '✉️ My Inquiries' },
  { to: '/account/password', label: '🔒 Password' },
];

export default function DashboardLayout() {
  const { isAuthenticated, user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--t3)' }}>
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login?redirect=/account" replace />;

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'My Account' }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">Hi, {user?.name?.split(' ')[0] || 'there'} 👋</h3>
          <div className="sec-sub">Manage your profile, addresses and inquiries</div>
        </div>
      </div>

      <div className="dashboard-wrap">
        <nav className="dashboard-nav">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end}
              className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
              {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

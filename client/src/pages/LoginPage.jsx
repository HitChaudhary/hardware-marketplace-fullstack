import { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login, isAuthenticated, loadingUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loadingUser && isAuthenticated) return <Navigate to={redirect} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      showToast('Welcome back!', 'success');
      navigate(redirect, { replace: true });
    } else {
      setError(result.reason);
    }
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h2 style={{ marginBottom: 6 }}>Sign In</h2>
        <p style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 24 }}>
          New customer?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}
            style={{ color: 'var(--acc)', fontWeight: 600 }}>
            Create an account
          </Link>
        </p>

        <div className="checkout-section">
          <form onSubmit={handleSubmit}>
            <div className="checkout-form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600,
                  display: 'block', marginBottom: 6 }}>Email address</label>
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600,
                  display: 'block', marginBottom: 6 }}>Password</label>
                <input type="password" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" required />
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 12,
                padding: '8px 12px', background: 'color-mix(in srgb,var(--red) 10%,transparent)',
                borderRadius: 6 }}>
                {error}
              </p>
            )}

            <button type="submit" className="ncall" disabled={loading}
              style={{ marginTop: 20, width: '100%', justifyContent: 'center', animation: 'none' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

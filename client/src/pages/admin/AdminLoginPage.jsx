import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLoginPage() {
  const { isAdmin, adminLogin } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const cleanUsername = username.trim().toLowerCase();
    
    // Capture the return object from your context wrapper
    const result = await adminLogin(cleanUsername, password);
    
    if (result && result.ok) {
      // If it passed, navigate to your admin panel dashboard view safely
      navigate('/admin');
    } else {
      // If it failed, extract the captured reason directly from your return object
      setError(result.reason || 'Incorrect username or password.');
    }
  } catch (err) {
    setError('Could not connect to the authentication server.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative">
      <button onClick={toggleTheme} title="Toggle theme"
        className="absolute top-5 right-5 w-[38px] h-[38px] rounded-lg bg-s2 border border-b2 text-t1 flex items-center justify-center cursor-pointer hover:bg-s1 transition-colors">
        🌓
      </button>

      <img src={logo} alt="AK Computer Solutions" className="h-12 mb-8 object-contain" />

      <div className="w-full max-w-sm bg-s2 border border-b1 rounded-card shadow-card p-8">
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-acc-g text-white px-3 py-1 rounded-pill mb-4">
          Admin
        </span>
        <h2 className="text-xl font-bold text-t1 mb-1">Sign in to manage the store</h2>
        <p className="text-sm text-t3 mb-6">Staff access only.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="w-full px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className="w-full px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          
          {/* Replaced 'text-red' utility to match standard tailwind definitions if needed */}
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-acc-g text-white text-sm font-semibold mt-1 disabled:opacity-60 cursor-pointer hover:opacity-90 transition-opacity">
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>
      </div>

      <Link to="/" className="mt-5 text-sm text-t3 hover:text-t1 no-underline transition-colors">
        &larr; Back to Store
      </Link>
    </div>
  );
}
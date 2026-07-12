import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, getAdminToken, setAdminToken } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null); // logged-in admin profile

  // Admin sessions are simple — we trust the stored token + a lightweight
  // profile snapshot, refreshed on each protected admin call's 401 response
  // (see AdminLayout/RequireAdmin).
  useEffect(() => {
    const adminToken = getAdminToken();
    const adminProfileRaw = (() => {
      try {
        return localStorage.getItem('ak-admin-profile');
      } catch {
        return null;
      }
    })();
    if (adminToken && adminProfileRaw) {
      try {
        setAdmin(JSON.parse(adminProfileRaw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    try {
      const data = await apiFetch('/admin/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      setAdminToken(data.token);
      try {
        localStorage.setItem('ak-admin-profile', JSON.stringify(data.admin));
      } catch {
        /* ignore */
      }
      setAdmin(data.admin);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err.message };
    }
  }, []);

  const adminLogout = useCallback(() => {
    setAdminToken(null);
    try {
      localStorage.removeItem('ak-admin-profile');
    } catch {
      /* ignore */
    }
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAdmin: !!admin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

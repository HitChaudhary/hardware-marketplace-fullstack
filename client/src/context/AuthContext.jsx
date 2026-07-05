import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  apiFetch,
  getCustomerToken,
  setCustomerToken,
  getAdminToken,
  setAdminToken,
} from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // logged-in customer profile
  const [admin, setAdmin] = useState(null); // logged-in admin profile
  const [loadingUser, setLoadingUser] = useState(true);

  // On mount, if a customer token exists, fetch the profile to confirm it's
  // still valid and populate `user`. Admin sessions are simpler — we trust
  // the stored token + a lightweight "isAdmin" flag, refreshed on each
  // protected admin call's 401 response (see AdminLayout/RequireAdmin).
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const token = getCustomerToken();
      if (!token) {
        setLoadingUser(false);
        return;
      }
      try {
        const data = await apiFetch('/auth/me', { authAs: 'customer' });
        if (!cancelled) setUser(data.user);
      } catch {
        setCustomerToken(null);
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    }

    hydrate();

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

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Customer auth ----

  const register = useCallback(async ({ name, email, phone, password, address }) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: { name, email, phone, password, address },
      });
      setCustomerToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err.message };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setCustomerToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    setCustomerToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const data = await apiFetch('/users/me', {
        method: 'PUT',
        authAs: 'customer',
        body: updates,
      });
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err.message };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch('/auth/me', { authAs: 'customer' });
      setUser(data.user);
    } catch {
      /* ignore */
    }
  }, []);

  // ---- Admin auth ----

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
        // customer
        user,
        isAuthenticated: !!user,
        loadingUser,
        register,
        login,
        logout,
        updateProfile,
        refreshUser,
        // admin
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

// Thin fetch wrapper for the AK Computer Solutions API.
// Keeps base URL, JSON handling, auth headers, and error shape in one place
// so contexts/pages don't repeat fetch() boilerplate.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ADMIN_TOKEN_KEY = 'ak-admin-token';

export function getAdminToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * @param {string} path - e.g. '/products' or '/admin/auth/login'
 * @param {object} options
 * @param {'admin'|null} options.authAs - which token to attach, if any
 */
export async function apiFetch(path, { method = 'GET', body, authAs = null, headers = {} } = {}) {
  // 1. Check if the incoming request payload is multi-part image binary data
  const isFormData = body instanceof FormData;

  // 2. Set content type to JSON ONLY if it's not a multipart file upload
  const finalHeaders = { 
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }), 
    ...headers 
  };

  if (authAs === 'admin') {
    const token = getAdminToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      // 3. Keep standard objects stringified, but let FormData stream natively
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    const err = new Error(
      'Could not reach the server. Please check your connection and try again.'
    );
    err.cause = networkErr;
    throw err;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
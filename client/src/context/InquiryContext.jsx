import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, getAdminToken } from '../utils/api';

const InquiryContext = createContext(null);

export function InquiryProvider({ children }) {
  // Admin-facing: all inquiries loaded from API (used in admin panel)
  const [inquiries, setInquiries] = useState([]);
  // Customer-facing: the customer's own inquiries (from /users/me/inquiries)
  const [myInquiries, setMyInquiries] = useState([]);
  const [adminLoaded, setAdminLoaded] = useState(false);

  // Fetch all inquiries for admin panel
  const loadAdminInquiries = useCallback(async () => {
    try {
      const data = await apiFetch('/inquiries', { authAs: 'admin' });
      setInquiries(data.inquiries || []);
      setAdminLoaded(true);
    } catch {
      /* not admin or not connected - keep empty */
    }
  }, []);

  // Load admin inquiries when admin token exists
  useEffect(() => {
    const token = getAdminToken();
    if (token) loadAdminInquiries();
  }, [loadAdminInquiries]);

  // Customer: fetch their own inquiries
  const loadMyInquiries = useCallback(async () => {
    try {
      const data = await apiFetch('/users/me/inquiries', { authAs: 'customer' });
      setMyInquiries(data.inquiries || []);
    } catch {
      setMyInquiries([]);
    }
  }, []);

  // Customer: submit new inquiry (login-gated - caller must check isAuthenticated first)
  const submitInquiry = useCallback(async ({ phone, email, message, items, address }) => {
    const data = await apiFetch('/inquiries', {
      method: 'POST',
      authAs: 'customer',
      body: { phone, email, message, items, address },
    });
    // Prepend to myInquiries so "Inquiry Sent" page can read it instantly
    setMyInquiries((prev) => [data.inquiry, ...prev]);
    return data.inquiry;
  }, []);

  // Admin: update inquiry status
  const updateStatus = useCallback(async (id, status) => {
    try {
      const data = await apiFetch(`/inquiries/${id}/status`, {
        method: 'PATCH',
        authAs: 'admin',
        body: { status },
      });
      setInquiries((prev) => prev.map((i) => (i._id === id ? data.inquiry : i)));
    } catch {
      /* ignore */
    }
  }, []);

  // Admin: delete inquiry
  const removeInquiry = useCallback(async (id) => {
    try {
      await apiFetch(`/inquiries/${id}`, { method: 'DELETE', authAs: 'admin' });
      setInquiries((prev) => prev.filter((i) => i._id !== id));
    } catch {
      /* ignore */
    }
  }, []);

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <InquiryContext.Provider value={{
      inquiries,
      myInquiries,
      submitInquiry,
      updateStatus,
      removeInquiry,
      loadAdminInquiries,
      loadMyInquiries,
      newCount,
      adminLoaded,
    }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiries() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error('useInquiries must be used within an InquiryProvider');
  return ctx;
}

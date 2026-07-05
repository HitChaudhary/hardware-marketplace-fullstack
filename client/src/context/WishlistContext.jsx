import { createContext, useContext, useEffect, useState } from 'react';
import { useProductStore } from './ProductStoreContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'ak-wishlist';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { products } = useProductStore();
  const [ids, setIds] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const isWishlisted = (id) => ids.includes(id);

  const toggleWishlist = (id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const removeFromWishlist = (id) => setIds((prev) => prev.filter((x) => x !== id));

  const wishlistProducts = ids
    .map((id) => products.find((p) => p._id === id || p.id === id || p.slug === id))
    .filter(Boolean);

  return (
    <WishlistContext.Provider
      value={{ ids, wishlistProducts, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}

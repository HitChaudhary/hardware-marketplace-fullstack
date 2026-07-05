import { createContext, useContext, useEffect, useState } from 'react';
import { products } from '../data/products';

const CompareContext = createContext(null);
const STORAGE_KEY = 'ak-compare';
const MAX_COMPARE = 4;

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const isComparing = (id) => ids.includes(id);

  const addToCompare = (id) => {
    if (ids.includes(id)) return { ok: true };
    if (ids.length >= MAX_COMPARE) return { ok: false, reason: `You can compare up to ${MAX_COMPARE} products at a time.` };
    setIds((prev) => [...prev, id]);
    return { ok: true };
  };

  const removeFromCompare = (id) => setIds((prev) => prev.filter((x) => x !== id));
  const toggleCompare = (id) => (isComparing(id) ? removeFromCompare(id) : addToCompare(id));
  const clearCompare = () => setIds([]);

  const compareProducts = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <CompareContext.Provider
      value={{ ids, compareProducts, isComparing, addToCompare, removeFromCompare, toggleCompare, clearCompare, MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
}

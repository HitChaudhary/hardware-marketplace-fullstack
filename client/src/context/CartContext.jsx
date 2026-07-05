import { createContext, useContext, useEffect, useState } from 'react';
import { useProductStore } from './ProductStoreContext';

const matchProduct = (products, key) =>
  products.find((p) => p._id === key || p.id === key || p.slug === key);

const CartContext = createContext(null);
const STORAGE_KEY = 'ak-cart';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { products } = useProductStore();
  const [items, setItems] = useState(loadInitial); // [{ productId, qty }]

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addToCart = (product, qty = 1) => {
    const key = product._id || product.id || product.slug;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === key);
      if (existing) {
        return prev.map((i) =>
          i.productId === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId: key, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const cartLines = items
    .map((i) => {
      const product = matchProduct(products, i.productId);
      return product ? { product, qty: i.qty } : null;
    })
    .filter(Boolean);

  const itemCount = cartLines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, cartLines, itemCount, subtotal, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

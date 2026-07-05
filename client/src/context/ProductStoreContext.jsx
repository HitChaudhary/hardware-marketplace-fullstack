import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api'; // Utilizing your clean fetch wrapper instance

const ProductStoreContext = createContext(null);

export function ProductStoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch live product catalog records directly from MongoDB
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/products');
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products from database:', err);
      setError(err.message || 'Could not fetch catalog records.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product catalog on initial engine boot up
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Synchronously scan state mapping arrays for individual matching criteria
  const getProduct = useCallback((idOrSlug) => {
    return products.find((p) => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug);
  }, [products]);

  // 2. Dispatch product parameters to your server using POST endpoints
  const addProduct = async (formData) => {
    try {
      // Automatically construct a slug parameters match if missing in state
      const slugified = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload = {
  name: formData.name,
  slug: slugified,
  brand: formData.brand?.trim() || 'Generic',
  category: formData.category,

  price: Number(formData.price) || 0,
  oldPrice:
    formData.oldPrice !== '' && formData.oldPrice !== undefined
      ? Number(formData.oldPrice)
      : undefined,

  badge: formData.badge || '',
  image: formData.image?.trim(),

  description: formData.description?.trim() || '',

  featured: formData.featured === true,
  inStock: formData.inStock !== false,

  stockQty:
    formData.stockQty !== '' && formData.stockQty !== undefined
      ? Number(formData.stockQty)
      : undefined,

  specs: formData.specs || {}
};

      const data = await apiFetch('/products', {
        method: 'POST',
        body: payload,
        authAs: 'admin' // Protects pipeline actions via admin authorization guards
      });

      if (data && data.product) {
        // Optimistic State Update: Instantly inject the newly processed model into view states
        setProducts((prev) => [data.product, ...prev]);
        return data.product;
      }
    } catch (err) {
      console.error('Failed to create product in backend:', err);
      throw new Error(err.message || 'Could not write catalog entries.');
    }
  };

  // 3. Dispatch changes to target items using dynamic PUT endpoints
  const updateProduct = async (id, formData) => {
    try {
      // Find database primary key mappings safely
      const targetProduct = products.find((p) => p.id === id || p._id === id);
      const dbId = targetProduct?._id || id;

      const payload = {
        ...formData,
        price: formData.price !== undefined ? Number(formData.price) : undefined,
        oldPrice: formData.oldPrice !== undefined && formData.oldPrice !== '' ? Number(formData.oldPrice) : undefined,
        stockQty: formData.stockQty !== undefined && formData.stockQty !== '' ? Number(formData.stockQty) : undefined,
      };

      // Clean up undefined parameters cleanly to protect database constraints
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      const data = await apiFetch(`/products/${dbId}`, {
        method: 'PUT',
        body: payload,
        authAs: 'admin'
      });

      if (data && data.product) {
        // Map changes directly into client views without triggering an extra HTTP refresh round-trip
        setProducts((prev) => prev.map((p) => (p._id === dbId || p.id === id) ? data.product : p));
        return data.product;
      }
    } catch (err) {
      console.error('Failed to patch document mapping attributes:', err);
      throw new Error(err.message || 'Could not update product specs.');
    }
  };

  // 4. Trigger soft deletion flags across database schemas using DELETE endpoints
  const deleteProduct = async (id) => {
    try {
      const targetProduct = products.find((p) => p.id === id || p._id === id);
      const dbId = targetProduct?._id || id;

      await apiFetch(`/products/${dbId}`, {
        method: 'DELETE',
        authAs: 'admin'
      });

      // Erase item out of active rendering hooks instantly
      setProducts((prev) => prev.filter((p) => p._id !== dbId && p.id !== id));
    } catch (err) {
      console.error('Failed to soft delete document from collection:', err);
      throw new Error(err.message || 'Could not delete product record.');
    }
  };

  // 5. Dynamic Stock resolution directly reading MongoDB schema outputs
  const getStock = (product) => {
    if (!product) return 'out';
    if (product.inStock === false || product.isDeleted === true) return 'out';
    if (product.stockQty !== undefined) {
      if (product.stockQty <= 0) return 'out';
      if (product.stockQty <= 4) return 'low';
      return 'in';
    }
    return 'in'; // Default safely to standard stock context markers
  };

  const getStockQty = (product) => {
    if (!product) return 0;
    if (product.inStock === false || product.isDeleted === true) return 0;
    if (product.stockQty !== undefined) return product.stockQty;
    return 10; // Default safety fallback boundary metric
  };

  return (
    <ProductStoreContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts, // Expose refetch trigger for pull-to-refresh indicators if needed
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        getStock,
        getStockQty,
      }}
    >
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore() {
  const ctx = useContext(ProductStoreContext);
  if (!ctx) throw new Error('useProductStore must be used within a ProductStoreProvider');
  return ctx;
}
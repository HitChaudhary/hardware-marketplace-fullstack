import HeroSlider from '../components/HeroSlider';
import TrustBar from '../components/TrustBar';
import ProductGrid from '../components/ProductGrid';
import { useProductStore } from '../context/ProductStoreContext';

export default function Home() {
  const { products, loading } = useProductStore();
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <HeroSlider />
      <TrustBar />

      {featured.length > 0 && (
        <main className="sec a3">
          <div className="sec-head">
            <h3 className="sec-title">Featured Collections</h3>
          </div>
          {loading ? <p>Loading products…</p> : <ProductGrid products={featured} />}
        </main>
      )}

      <main className="sec a3">
        <div className="sec-head">
          <h3 className="sec-title">All Products</h3>
        </div>
        {loading ? <p>Loading products…</p> : <ProductGrid products={products} />}
      </main>
    </>
  );
}

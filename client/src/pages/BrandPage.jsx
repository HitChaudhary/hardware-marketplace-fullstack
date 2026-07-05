import { Navigate, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import BrandBanner from '../components/BrandBanner';
import ProductGrid from '../components/ProductGrid';
import { getBrandBySlug } from '../data/brands';
import { useProductStore } from '../context/ProductStoreContext';

const GAMING_CATS = ['custom-pc-builds', 'graphic-cards'];
const BUSINESS_CATS = ['new-laptops', 'refurbished-laptops'];

export default function BrandPage() {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);
  const { products, loading } = useProductStore();

  if (!brand) return <Navigate to="/" replace />;
  if (loading) return <main className="sec a3"><p>Loading…</p></main>;

  const brandProducts = products.filter((p) => p.brand.toLowerCase() === brand.name.toLowerCase());
  const gaming = brandProducts.filter((p) => GAMING_CATS.includes(p.category));
  const business = brandProducts.filter((p) => BUSINESS_CATS.includes(p.category));
  const accessories = brandProducts.filter((p) => !GAMING_CATS.includes(p.category) && !BUSINESS_CATS.includes(p.category));

  return (
    <main>
      <BrandBanner brand={brand} />
      <div className="sec a3">
        <Breadcrumb items={[{ label: brand.name }]} />

        {brandProducts.length === 0 && (
          <p style={{ color: 'var(--t3)' }}>No products from {brand.name} listed yet — check back soon.</p>
        )}

        {brandProducts.length > 0 && (
          <>
            <div className="sec-head"><h3 className="sec-title">Featured {brand.name} Products</h3></div>
            <ProductGrid products={brandProducts.slice(0, 4)} />
          </>
        )}

        {gaming.length > 0 && (
          <>
            <div className="sec-head" style={{ marginTop: 32 }}><h3 className="sec-title">Gaming</h3></div>
            <ProductGrid products={gaming} />
          </>
        )}

        {business.length > 0 && (
          <>
            <div className="sec-head" style={{ marginTop: 32 }}><h3 className="sec-title">Business & Everyday</h3></div>
            <ProductGrid products={business} />
          </>
        )}

        {accessories.length > 0 && (
          <>
            <div className="sec-head" style={{ marginTop: 32 }}><h3 className="sec-title">Accessories</h3></div>
            <ProductGrid products={accessories} />
          </>
        )}
      </div>
    </main>
  );
}

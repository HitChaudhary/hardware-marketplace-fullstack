import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import RatingStars from '../components/RatingStars';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getRating, getReviewCount } from '../utils/productMeta';

const formatPrice = (n) => `₹${n?.toLocaleString('en-IN')}`;

export default function ProductDetailsPage() {
  const { idOrSlug } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${idOrSlug}`);
        if (res.ok) {
          const payload = await res.json();
          
          if (payload && typeof payload === 'object') {
            if (payload._id || payload.id) {
              setProduct(payload); 
            } else if (payload.product && typeof payload.product === 'object') {
              setProduct(payload.product); 
            } else if (payload.data && typeof payload.data === 'object') {
              setProduct(payload.data); 
            } else {
              console.error("Product fields not found in API response structure:", payload);
            }
          }
        }
      } catch (err) {
        console.error("Error reading details from database:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [idOrSlug]);       

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--t1)' }}>
        <h3>Loading Product Details...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--t1)' }}>
        <h3>Product Not Found</h3>
        <button className="padd" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Return to Shop
        </button>
      </div>
    );
  }

  const safeProductForMeta = {
    brand: '',
    category: '',
    sku: '',
    reviews: [],
    rating: 0,
    ...product
  };

  const productId = product._id || product.id;
  const isOutOfStock = product.inStock === false || product.stockQty <= 0;

  // Derive if there are any readable specs available inside the mixed object block
  const hasSpecs = product.specs && Object.keys(product.specs).some(key => product.specs[key]);

  const handleActionClick = () => {
    if (isOutOfStock) {
      navigate(`/inquiry?product=${productId}`);
    } else if (product.isPcBuilderTemplate || product.category === 'custom-pc-builds') {
      navigate(`/build-pc?template=${productId}`);
    } else {
      addToCart(product, qty);
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  return (
    <main className="sec a3" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Breadcrumb items={[{ label: 'Products', to: '/' }, { label: product.name }]} />
      
      <div className="build-pc-layout" style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Product Visual Box */}
        <div style={{ flex: '1 1 450px', background: '#fff', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border)' }}>
          <img 
            src={product.image || '/placeholder-pc.png'} 
            alt={product.name} 
            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
          />
        </div>

        {/* Right Side: Information Matrix Content */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <span className="pbrand" style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--t2)' }}>{product.brand || 'Generic'}</span>
            <h2 className="sec-title" style={{ marginTop: '5px', marginBottom: '10px' }}>{product.name}</h2>
            <RatingStars rating={getRating(safeProductForMeta)} count={getReviewCount(safeProductForMeta)} size={14} />
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <span className="pnew" style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="pold" style={{ textDecoration: 'line-through', color: 'var(--t3)', fontSize: '18px' }}>
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div style={{ color: 'var(--t2)', fontSize: '14px', lineHeight: '1.6' }}>
            {product.description || "High-performance hardware component verified for elite speed and reliability matrix compliance."}
          </div>

          {/* Dynamic Technical Specs Sheet Layout Rendering Block */}
          {hasSpecs && (
            <div style={{ backgroundColor: 'var(--s1, #f8fafc)', border: '1px solid var(--border)', borderRadius: '8px', padding: '15px', marginTop: '5px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', uppercase: 'true', letterSpacing: '0.05em', color: 'var(--primary)' }}>
                📋 Technical Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', fontSize: '13px' }}>
                {product.specs.processor && (
                  <div><strong style={{ color: 'var(--t3)' }}>CPU:</strong> <span style={{ color: 'var(--t1)' }}>{product.specs.processor}</span></div>
                )}
                {product.specs.ram && (
                  <div><strong style={{ color: 'var(--t3)' }}>Memory:</strong> <span style={{ color: 'var(--t1)' }}>{product.specs.ram}</span></div>
                )}
                {product.specs.storage && (
                  <div><strong style={{ color: 'var(--t3)' }}>Storage:</strong> <span style={{ color: 'var(--t1)' }}>{product.specs.storage}</span></div>
                )}
                {product.specs.graphics && (
                  <div><strong style={{ color: 'var(--t3)' }}>Graphics:</strong> <span style={{ color: 'var(--t1)' }}>{product.specs.graphics}</span></div>
                )}
                {product.specs.cooler && (
                  <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--t3)' }}>Thermal System:</strong> <span style={{ color: 'var(--t1)' }}>{product.specs.cooler}</span></div>
                )}
              </div>
            </div>
          )}

          <hr style={{ border: '0', borderTop: '1px solid var(--border)' }} />

          {/* User Interactivity Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
            {!isOutOfStock && !(product.isPcBuilderTemplate || product.category === 'custom-pc-builds') && (
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer' }}>-</button>
                <span style={{ padding: '0 12px', fontWeight: 'bold' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer' }}>+</button>
              </div>
            )}

            <button 
              type="button" 
              className="ncall" 
              onClick={handleActionClick}
              style={{ padding: '12px 30px', fontSize: '16px', minWidth: '200px', justifyContent: 'center', animation: 'none' }}
            >
              {isOutOfStock ? '✉ Inquire Anyway' : (product.isPcBuilderTemplate || product.category === 'custom-pc-builds') ? '🛠 Configure Build' : '🛒 Add to Cart'}
            </button>
          </div>
          
          <div style={{ marginTop: '10px', fontSize: '13px', color: isOutOfStock ? 'var(--red)' : 'var(--green)' }}>
            ● {isOutOfStock ? 'Out of Stock' : 'Item is In Stock & ready to ship'}
          </div>
        </div>
      </div>
    </main>
  );
}
import { Link } from 'react-router-dom';
import { formatPrice } from './PriceBox';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function DealCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Backend product lookup route only matches by slug, so prefer slug
  // over the raw database id (same pattern used in ProductCard.jsx)
  const routeTarget = product.slug || product._id || product.id;

  return (
    <div className="pcard deal-card">
      <Link to={`/product/${routeTarget}`} className="pcard-top" style={{ textDecoration: 'none' }}>
        <span className="pbadge sale">{product.discount}% off</span>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="pcard-body">
        <div className="pcard-mid-specs">
          <span className="pbrand">{product.brand}</span>
          <h4 className="pname">{product.name}</h4>
        </div>
        <div className="pcard-bot-action">
          <div className="pprice">
            <span className="pnew">{formatPrice(product.price)}</span>
            <span className="pold">{formatPrice(product.oldPrice)}</span>
          </div>
          <button
            className="padd"
            onClick={() => {
              addToCart(product);
              showToast(`${product.name} added to cart`, 'success');
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

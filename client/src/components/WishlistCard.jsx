import { Link } from 'react-router-dom';
import { formatPrice } from './PriceBox';

export default function WishlistCard({ product, onMoveToCart, onRemove }) {
  return (
    <div className="pcard wishlist-card">
      <Link to={`/product/${product.id}`} className="pcard-top" style={{ textDecoration: 'none' }}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="pcard-body">
        <div className="pcard-mid-specs">
          <span className="pbrand">{product.brand}</span>
          <h4 className="pname">{product.name}</h4>
        </div>
        <div className="pcard-bot-action">
          <div className="pprice">
            <span className="pnew">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="pold">{formatPrice(product.oldPrice)}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="padd" onClick={() => onMoveToCart(product)}>
              Move to Cart
            </button>
            <button className="padd" style={{ flex: '0 0 44px' }} onClick={() => onRemove(product.id)} aria-label="Remove from wishlist">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

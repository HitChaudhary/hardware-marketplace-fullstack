import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import RatingStars from './RatingStars';
import { getRating, getReviewCount, getStock } from '../utils/productMeta';
import { getWhatsappPriceLink } from '../utils/whatsapp';

const BADGE_LABELS = {
  sale: 'Sale',
  refurb: 'Refurbished',
  new: 'New',
  hot: 'Hot',
};

export default function ProductCard({ product }) {
  const { brand, name, badge, image } = product;
  const { isComparing, toggleCompare } = useCompare();
  const { showToast } = useToast();

  const productId = product._id || product.id;
  const routeTarget = product.slug || productId;

  const comparing = isComparing(productId);
  const stock = getStock(product);

  const handleCompare = (e) => {
    e.preventDefault();
    const result = toggleCompare(productId);
    if (result && result.ok === false) {
      showToast(result.reason, 'error');
    }
  };

  return (
    <div className="pcard">
      <Link to={`/product/${routeTarget}`} className="pcard-top" style={{ textDecoration: 'none' }}>
        {badge && (
          <span className={`pbadge ${badge}`}>{BADGE_LABELS[badge] || badge}</span>
        )}
        <div className="pcard-quick-actions">
          <button
            type="button"
            className={`pquick ${comparing ? 'active' : ''}`}
            onClick={handleCompare}
            aria-label="Toggle compare"
            title="Compare"
          >
            ⇄
          </button>
        </div>
        <img src={image} alt={name} loading="lazy" className="bg-white object-contain" />
      </Link>
      <div className="pcard-body">
        <div className="pcard-mid-specs">
          <span className="pbrand">{brand}</span>
          <Link to={`/product/${routeTarget}`} style={{ textDecoration: 'none' }}>
            <h4 className="pname">{name}</h4>
          </Link>
          <RatingStars rating={getRating(product)} count={getReviewCount(product)} size={11} />
        </div>
        <div className="pcard-bot-action">
          <a
            href={getWhatsappPriceLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="padd"
            style={{ textDecoration: 'none', background: '#25D366', color: '#fff', borderColor: '#25D366' }}
          >
            <MessageCircle size={14} strokeWidth={2} /> Check Price
          </a>
          <Link to={`/product/${routeTarget}`} className="padd" style={{ textDecoration: 'none' }}>
            {stock === 'out' ? 'Out of Stock' : 'View'}
          </Link>
        </div>
      </div>
    </div>
  );
}

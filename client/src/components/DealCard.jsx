import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { getWhatsappPriceLink } from '../utils/whatsapp';

export default function DealCard({ product }) {
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
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

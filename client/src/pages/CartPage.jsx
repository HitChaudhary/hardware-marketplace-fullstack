import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import QuantitySelector from '../components/QuantitySelector';
import OrderSummary from '../components/OrderSummary';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../components/PriceBox';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartLines, subtotal, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
      <div className="sec-head">
        <h3 className="sec-title">Shopping Cart</h3>
      </div>

      {cartLines.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Browse our categories and add something you like."
          actionLabel="Continue Shopping"
          actionTo="/"
        />
      ) : (
        <div className="cart-page-layout">
          <div className="cart-page-lines">
            {cartLines.map(({ product, qty }) => {
              // Cart items are keyed by _id/id/slug (see CartContext.addToCart) —
              // must match the same key here or updateQty/removeFromCart silently no-op.
              const cartKey = product._id || product.id || product.slug;
              const routeTarget = product.slug || product._id || product.id;
              return (
                <div className="cart-line" key={cartKey}>
                  <Link to={`/product/${routeTarget}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="cart-line-info">
                    <Link to={`/product/${routeTarget}`} className="cart-line-name">
                      {product.name}
                    </Link>
                    <span className="pbrand">{product.brand}</span>
                    <div className="cart-line-price">{formatPrice(product.price)}</div>
                  </div>
                  <QuantitySelector qty={qty} onChange={(q) => updateQty(cartKey, q)} />
                  <div className="cart-line-total">{formatPrice(product.price * qty)}</div>
                  <button className="cart-drawer-remove" onClick={() => removeFromCart(cartKey)} aria-label="Remove item">
                    ✕
                  </button>
                </div>
              );
            })}

            <Link to="/" className="fl" style={{ marginTop: 8 }}>
              ← Continue Shopping
            </Link>
          </div>

          <div className="cart-page-side">
            <OrderSummary
              subtotal={subtotal}
              shipping={0}
              gstRate={0}
              discount={0}
              actionLabel="Send Inquiry"
              onAction={() => navigate('/inquiry')}
              note="Submitting sends an inquiry to our team — no payment is taken here. Final pricing will be confirmed when we contact you."
            />
          </div>
        </div>
      )}
    </main>
  );
}

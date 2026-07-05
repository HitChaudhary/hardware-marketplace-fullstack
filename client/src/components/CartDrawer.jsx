import { Link } from 'react-router-dom';
import { useDrawer } from '../context/DrawerContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from './PriceBox';
import QuantitySelector from './QuantitySelector';

export default function CartDrawer() {
  const { activeDrawer, closeAll } = useDrawer();
  const { cartLines, itemCount, subtotal, updateQty, removeFromCart } = useCart();

  return (
    <aside className={`sidebar-drawer right-1 ${activeDrawer === 'cart' ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 className="sb-title" style={{ margin: 0 }}>
          Your Basket {itemCount > 0 && `(${itemCount})`}
        </h3>
        <button
          onClick={closeAll}
          style={{ background: 'none', border: 'none', color: 'var(--t1)', cursor: 'pointer', fontSize: 22 }}
        >
          &times;
        </button>
      </div>

      {cartLines.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--t3)',
          }}
        >
          <p style={{ fontSize: 28, marginBottom: 8 }}>🛒</p>
          <p style={{ fontSize: 13, fontWeight: 500 }}>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="cart-drawer-lines">
            {cartLines.map(({ product, qty }) => {
              // Cart items are keyed by _id/id/slug (see CartContext.addToCart) —
              // must match the same key here or updateQty/removeFromCart silently no-op.
              const cartKey = product._id || product.id || product.slug;
              const routeTarget = product.slug || product._id || product.id;
              return (
                <div className="cart-drawer-line" key={cartKey}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-drawer-line-info">
                    <Link to={`/product/${routeTarget}`} onClick={closeAll}>
                      {product.name}
                    </Link>
                    <span className="cart-drawer-line-price">{formatPrice(product.price)}</span>
                    <QuantitySelector qty={qty} onChange={(q) => updateQty(cartKey, q)} />
                  </div>
                  <button className="cart-drawer-remove" onClick={() => removeFromCart(cartKey)} aria-label="Remove">
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link to="/cart" className="padd" style={{ textDecoration: 'none', textAlign: 'center' }} onClick={closeAll}>
              View Cart
            </Link>
            <Link
              to="/inquiry"
              className="ncall"
              style={{ textDecoration: 'none', justifyContent: 'center', animation: 'none' }}
              onClick={closeAll}
            >
              Send Inquiry
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}

import Breadcrumb from '../components/Breadcrumb';
import WishlistCard from '../components/WishlistCard';
import EmptyState from '../components/EmptyState';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function WishlistPage() {
  const { wishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <div className="sec-head">
        <h3 className="sec-title">My Wishlist</h3>
        <div className="sec-sub">{wishlistProducts.length} saved items</div>
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon="💔"
          title="Your wishlist is empty"
          message="Tap the heart icon on any product to save it here."
          actionLabel="Browse Products"
          actionTo="/"
        />
      ) : (
        <div className="pgrid">
          {wishlistProducts.map((p) => (
            <WishlistCard
              key={p.id}
              product={p}
              onRemove={removeFromWishlist}
              onMoveToCart={(prod) => {
                addToCart(prod);
                removeFromWishlist(prod.id);
                showToast(`${prod.name} moved to cart`, 'success');
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}

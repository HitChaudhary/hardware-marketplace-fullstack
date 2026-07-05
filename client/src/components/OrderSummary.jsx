import { formatPrice } from './PriceBox';

export default function OrderSummary({ subtotal, shipping = 0, gstRate = 0.18, discount = 0, actionLabel, onAction, actionDisabled, note }) {
  const gst = Math.round((subtotal - discount) * gstRate);
  const total = subtotal - discount + shipping + gst;

  return (
    <div className="order-summary">
      <h4>Order Summary</h4>
      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="order-summary-row discount">
          <span>Coupon Discount</span>
          <span>−{formatPrice(discount)}</span>
        </div>
      )}
      {gstRate > 0 && (
        <div className="order-summary-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
      )}
      {gstRate > 0 && (
        <div className="order-summary-row">
          <span>GST ({Math.round(gstRate * 100)}%)</span>
          <span>{formatPrice(gst)}</span>
        </div>
      )}
      <div className="order-summary-row total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {actionLabel && (
        <button className="ncall" style={{ width: '100%', justifyContent: 'center', animation: 'none' }} onClick={onAction} disabled={actionDisabled}>
          {actionLabel}
        </button>
      )}
      {note && <p className="order-summary-note">{note}</p>}
    </div>
  );
}

export function calcTotal(subtotal, shipping = 0, gstRate = 0.18, discount = 0) {
  const gst = Math.round((subtotal - discount) * gstRate);
  return subtotal - discount + shipping + gst;
}

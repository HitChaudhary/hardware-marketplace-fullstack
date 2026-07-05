const formatPrice = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export default function PriceBox({ price, oldPrice, emi, size = 'md' }) {
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return (
    <div className={`price-box price-box-${size}`}>
      <div className="price-box-row">
        <span className="price-box-now">{formatPrice(price)}</span>
        {oldPrice && <span className="price-box-old">{formatPrice(oldPrice)}</span>}
        {discount && <span className="price-box-discount">{discount}% off</span>}
      </div>
      {emi && <div className="price-box-emi">or {formatPrice(emi)}/month with No-Cost EMI</div>}
    </div>
  );
}

export { formatPrice };

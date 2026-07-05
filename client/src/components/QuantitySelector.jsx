export default function QuantitySelector({ qty, onChange, min = 1, max = 99 }) {
  const dec = () => onChange(Math.max(min, qty - 1));
  const inc = () => onChange(Math.min(max, qty + 1));

  return (
    <div className="qty-selector">
      <button type="button" onClick={dec} disabled={qty <= min} aria-label="Decrease quantity">
        −
      </button>
      <span>{qty}</span>
      <button type="button" onClick={inc} disabled={qty >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

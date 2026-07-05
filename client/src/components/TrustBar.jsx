const ITEMS = [
  { label: '100% Genuine Products', sub: 'Certified components only' },
  { label: 'Same-day Delivery', sub: 'Available locally before 3 PM' },
  { label: '7-Day Easy Returns', sub: 'No questions asked policy' },
  { label: 'Secure Transacting', sub: 'UPI, Cards, and Easy EMIs' },
];

export default function TrustBar() {
  return (
    <section className="trust a3">
      {ITEMS.map((item, i) => (
        <div className="tstrip" key={i}>
          <div>
            <div className="ts-label">{item.label}</div>
            <div className="ts-sub">{item.sub}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

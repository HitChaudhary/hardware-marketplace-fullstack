import { Link } from 'react-router-dom';
import { getSpecs } from '../utils/productMeta';
import { formatPrice } from './PriceBox';

const ROWS = [
  { label: 'CPU', key: 'Processor' },
  { label: 'GPU', key: 'Graphics' },
  { label: 'RAM', key: 'RAM' },
  { label: 'SSD', key: 'Storage' },
  { label: 'Display', key: 'Display' },
  { label: 'Battery', key: 'Battery' },
  { label: 'Weight', key: 'Weight' },
];

export default function CompareTable({ products, onRemove, onAddToCart }) {
  if (products.length === 0) return null;

  const specsByProduct = products.map((p) => getSpecs(p));

  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th></th>
            {products.map((p, i) => (
              <th key={p.id}>
                <button className="compare-remove" onClick={() => onRemove(p.id)} aria-label="Remove from compare">
                  ✕
                </button>
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.name} />
                  <div className="compare-pname">{p.name}</div>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              {specsByProduct.map((specs, i) => (
                <td key={products[i].id}>{specs[row.key] || '—'}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th>Price</th>
            {products.map((p) => (
              <td key={p.id} className="compare-price">{formatPrice(p.price)}</td>
            ))}
          </tr>
          <tr>
            <th></th>
            {products.map((p) => (
              <td key={p.id}>
                <button className="padd" onClick={() => onAddToCart(p)}>
                  Add to Cart
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

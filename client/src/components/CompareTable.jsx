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

export default function CompareTable({ products, onRemove }) {
  if (products.length === 0) return null;

  const specsByProduct = products.map((p) => getSpecs(p));

  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th></th>
            {products.map((p) => {
              const pid = p._id || p.id;
              return (
                <th key={pid}>
                  <button className="compare-remove" onClick={() => onRemove(pid)} aria-label="Remove from compare">
                    ✕
                  </button>
                  <Link to={`/product/${p.slug || pid}`}>
                    <img src={p.image} alt={p.name} />
                    <div className="compare-pname">{p.name}</div>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              {specsByProduct.map((specs, i) => (
                <td key={products[i]._id || products[i].id}>{specs[row.key] || '—'}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th>Price</th>
            {products.map((p) => (
              <td key={p._id || p.id} className="compare-price">{formatPrice(p.price)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

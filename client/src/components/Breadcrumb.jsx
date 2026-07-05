import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  // items: [{ label, to }] — last item has no `to` (current page)
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          {' '}/{' '}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

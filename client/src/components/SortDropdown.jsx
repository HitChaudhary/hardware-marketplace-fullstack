const OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <select className="sort-dropdown" value={value} onChange={(e) => onChange(e.target.value)}>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          Sort by: {o.label}
        </option>
      ))}
    </select>
  );
}

export function sortProducts(products, sortBy) {
  const arr = [...products];
  switch (sortBy) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return arr.sort((a, b) => (b._rating || 0) - (a._rating || 0));
    case 'newest':
      return arr.reverse();
    default:
      return arr;
  }
}

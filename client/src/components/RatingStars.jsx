export default function RatingStars({ rating = 0, count, size = 13 }) {
  const full = Math.round(rating);

  return (
    <span className="rating-stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="star">
          {i <= full ? '★' : '☆'}
        </span>
      ))}
      <span className="rating-value">{rating.toFixed ? rating.toFixed(1) : rating}</span>
      {typeof count === 'number' && <span className="rating-count">({count})</span>}
    </span>
  );
}

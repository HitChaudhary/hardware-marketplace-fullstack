import RatingStars from './RatingStars';

export default function ReviewCard({ review }) {
  const { name, rating, date, comment, verified } = review;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="review-card">
      <div className="review-card-head">
        <div className="review-avatar">{initial}</div>
        <div>
          <div className="review-name">
            {name} {verified && <span className="review-verified">Verified Purchase</span>}
          </div>
          <RatingStars rating={rating} size={12} />
        </div>
        <div className="review-date">{date}</div>
      </div>
      <p className="review-comment">{comment}</p>
    </div>
  );
}

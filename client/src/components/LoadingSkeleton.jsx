export function SkeletonCard() {
  return (
    <div className="pcard skeleton-card">
      <div className="pcard-top skeleton-shimmer" />
      <div className="pcard-body">
        <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: 10 }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '85%', height: 14, marginTop: 8 }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: 14, marginTop: 6 }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '50%', height: 20, marginTop: 16 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="pgrid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ lines = 3, width = '100%' }) {
  return (
    <div className="skeleton-block">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line skeleton-shimmer"
          style={{ width: typeof width === 'string' ? width : width[i] || '100%' }}
        />
      ))}
    </div>
  );
}

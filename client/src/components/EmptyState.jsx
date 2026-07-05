import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '🗂️', title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <span>{icon}</span>
      {title && <h4>{title}</h4>}
      {message && <p>{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="ncall" style={{ marginTop: 8, animation: 'none', textDecoration: 'none' }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

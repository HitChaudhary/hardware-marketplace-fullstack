import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="sec a3 not-found">
      <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="30" width="140" height="90" rx="10" fill="var(--s1)" stroke="var(--b3)" strokeWidth="2" />
        <rect x="55" y="45" width="110" height="60" rx="6" fill="var(--s2)" stroke="var(--b2)" strokeWidth="2" />
        <circle cx="110" cy="75" r="22" stroke="var(--acc)" strokeWidth="4" fill="none" />
        <line x1="126" y1="91" x2="142" y2="107" stroke="var(--acc)" strokeWidth="4" strokeLinecap="round" />
        <rect x="90" y="128" width="40" height="8" rx="4" fill="var(--b3)" />
      </svg>
      <h1>404</h1>
      <p>The page you're looking for has been unplugged or never existed.</p>
      <Link to="/" className="ncall" style={{ textDecoration: 'none', animation: 'none' }}>
        Return Home
      </Link>
    </main>
  );
}

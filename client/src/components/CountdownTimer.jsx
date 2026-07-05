import { useEffect, useState } from 'react';

function getRemaining(endsAt) {
  const diff = Math.max(0, endsAt - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { diff, h, m, s };
}

export default function CountdownTimer({ endsAt, label }) {
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const pad = (n) => String(n).padStart(2, '0');

  if (remaining.diff <= 0) {
    return <span className="countdown-timer expired">Offer ended</span>;
  }

  return (
    <span className="countdown-timer">
      {label && <span className="countdown-label">{label}</span>}
      <span className="countdown-block">{pad(remaining.h)}</span>:
      <span className="countdown-block">{pad(remaining.m)}</span>:
      <span className="countdown-block">{pad(remaining.s)}</span>
    </span>
  );
}

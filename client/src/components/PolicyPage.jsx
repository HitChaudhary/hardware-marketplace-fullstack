import Breadcrumb from './Breadcrumb';

export function PolicyCard({ heading, children }) {
  return (
    <div className="policy-card">
      <h3>{heading}</h3>
      <div>{children}</div>
    </div>
  );
}

export default function PolicyPage({ title, updatedAt, sections }) {
  return (
    <main className="sec a3 policy-page">
      <Breadcrumb items={[{ label: title }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">{title}</h3>
          {updatedAt && <div className="sec-sub">Last updated: {updatedAt}</div>}
        </div>
      </div>
      <div className="policy-list">
        {sections.map((s, i) => (
          <PolicyCard heading={s.heading} key={i}>
            {Array.isArray(s.body) ? (
              <ul>
                {s.body.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            ) : (
              <p>{s.body}</p>
            )}
          </PolicyCard>
        ))}
      </div>
    </main>
  );
}

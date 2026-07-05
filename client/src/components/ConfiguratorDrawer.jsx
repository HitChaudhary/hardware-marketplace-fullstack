import { Link } from 'react-router-dom';
import { useDrawer } from '../context/DrawerContext';

const PANELS = [
  { label: 'Core CPU:', text: 'Choose Processor Intel/AMD' },
  { label: 'Graphics Card:', text: 'Choose NVIDIA/Radeon GPU' },
  { label: 'Memory:', text: 'Choose DDR4 / DDR5 RAM Kit' },
];

export default function ConfiguratorDrawer() {
  const { activeDrawer, closeAll } = useDrawer();

  return (
    <aside className={`sidebar-drawer right-2 ${activeDrawer === 'config' ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 className="sb-title" style={{ margin: 0 }}>
          PC Builder Panel
        </h3>
        <button
          onClick={closeAll}
          style={{ background: 'none', border: 'none', color: 'var(--t1)', cursor: 'pointer', fontSize: 22 }}
        >
          &times;
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--t2)' }}>
          Pick essential components to review performance specs instantly:
        </p>
        {PANELS.map((p, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              background: 'var(--s1)',
              border: '1px solid var(--b2)',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <strong style={{ color: 'var(--t1)' }}>{p.label}</strong> {p.text}
          </div>
        ))}
        <Link
          to="/build-pc"
          className="ncall"
          style={{ textDecoration: 'none', justifyContent: 'center', animation: 'none', marginTop: 8 }}
          onClick={closeAll}
        >
          Open Full PC Builder
        </Link>
      </div>
    </aside>
  );
}

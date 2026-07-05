import { useDrawer } from '../context/DrawerContext';

export default function Overlay() {
  const { activeDrawer, closeAll } = useDrawer();
  return (
    <div
      className={`sidebar-overlay ${activeDrawer ? 'open' : ''}`}
      onClick={closeAll}
    />
  );
}

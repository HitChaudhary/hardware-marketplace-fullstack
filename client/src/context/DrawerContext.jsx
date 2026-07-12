import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);

// activeDrawer is one of: null | 'left'
export function DrawerProvider({ children }) {
  const [activeDrawer, setActiveDrawer] = useState(null);

  const openLeft = () => setActiveDrawer('left');
  const closeAll = () => setActiveDrawer(null);

  return (
    <DrawerContext.Provider value={{ activeDrawer, openLeft, closeAll }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within a DrawerProvider');
  return ctx;
}

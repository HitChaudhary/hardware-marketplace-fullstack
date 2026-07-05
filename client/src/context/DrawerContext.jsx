import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);

// activeDrawer is one of: null | 'left' | 'cart' | 'config'
export function DrawerProvider({ children }) {
  const [activeDrawer, setActiveDrawer] = useState(null);

  const openLeft = () => setActiveDrawer('left');
  const openCart = () => setActiveDrawer('cart');
  const openConfig = () => setActiveDrawer('config');
  const closeAll = () => setActiveDrawer(null);

  return (
    <DrawerContext.Provider
      value={{ activeDrawer, openLeft, openCart, openConfig, closeAll }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within a DrawerProvider');
  return ctx;
}

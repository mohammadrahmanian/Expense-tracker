import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface NavigationSidebarContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  backgroundStyle: { top: number; height: number };
  setBackgroundStyle: (style: { top: number; height: number }) => void;
  navRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
  navContainerRef: React.MutableRefObject<HTMLElement | null>;
}

const NavigationSidebarContext = createContext<NavigationSidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(NavigationSidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within SidebarContextProvider');
  }
  return context;
};

export const SidebarContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState({ top: 0, height: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLElement | null>(null);

  return (
    <NavigationSidebarContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        backgroundStyle,
        setBackgroundStyle,
        navRefs,
        navContainerRef,
      }}
    >
      {children}
    </NavigationSidebarContext.Provider>
  );
};
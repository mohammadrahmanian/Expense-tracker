import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface SidebarContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  backgroundStyle: { top: number; height: number };
  setBackgroundStyle: (style: { top: number; height: number }) => void;
  navRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
  navContainerRef: React.MutableRefObject<HTMLElement | null>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState({ top: 0, height: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLElement | null>(null);

  return (
    <SidebarContext.Provider
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
    </SidebarContext.Provider>
  );
};
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

const tabs: TabItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    ariaLabel: 'Navigate to Dashboard',
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: Receipt,
    ariaLabel: 'Navigate to Transactions',
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: Settings,
    ariaLabel: 'Navigate to Categories',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: PieChart,
    ariaLabel: 'Navigate to Reports',
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    ariaLabel: 'Navigate to Profile',
  },
];

export const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveIndexRef = useRef(0);

  // Find the active tab index
  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.href === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  // Calculate tab position helper function with minimal delay
  const getTabPosition = (tabIndex: number): { left: number; width: number } => {
    const tab = tabRefs.current[tabIndex];
    const container = containerRef.current;
    
    if (tab && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      
      return {
        left: tabRect.left - containerRect.left,
        width: tabRect.width
      };
    }
    return { left: 0, width: 0 };
  };

  // Handle smooth transitions between tabs
  useEffect(() => {
    const animateBackgroundTransition = () => {
      // Wait for CSS transitions to complete (tabs have duration-250)
      // But start measuring slightly before completion for responsiveness
      setTimeout(() => {
        const newPosition = getTabPosition(activeIndex);
        setBackgroundStyle(newPosition);
        
        // Update the previous index reference
        previousActiveIndexRef.current = activeIndex;
      }, 100); // 250ms allows the flex transition (300ms) to nearly complete
    };

    animateBackgroundTransition();
  }, [activeIndex]);

  // Initialize refs array
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, []);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div ref={containerRef} className="relative flex h-16 px-4 py-2">
        {/* Sliding background indicator */}
        <div
          className="absolute top-2 bottom-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full transition-all duration-500 ease-in-out z-0"
          style={{
            left: `${backgroundStyle.left}px`,
            width: `${backgroundStyle.width}px`,
          }}
        />
        
        {tabs.map((tab, index) => {
          const isActive = location.pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              ref={(el) => (tabRefs.current[index] = el)}
              to={tab.href}
              className={cn(
                'relative flex items-center justify-center transition-all duration-250 ease-in-out z-10',
                'focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none',
                isActive
                  ? 'flex-[2] px-4 py-2 mx-1'
                  : 'flex-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
              )}
              style={{
                outline: 'none !important',
                boxShadow: 'none !important',
                border: 'none !important'
              }}
              onFocus={(e) => e.target.blur()}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-all duration-250 ease-in-out',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 mr-2'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium transition-all duration-250 ease-in-out',
                  'text-indigo-600 dark:text-indigo-400',
                  isActive
                    ? 'opacity-100 translate-x-0 max-w-none'
                    : 'opacity-0 translate-x-2 max-w-0 overflow-hidden'
                )}
                style={{
                  transitionProperty: 'opacity, transform, max-width',
                  transitionDuration: '400ms',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
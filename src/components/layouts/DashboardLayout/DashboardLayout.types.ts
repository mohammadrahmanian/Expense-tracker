import React from "react";

export type DashboardLayoutProps = {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFab?: boolean;
  hideBottomTab?: boolean;
};

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export interface DashboardSidebarProps {
  closeButton?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface UserProfileMenuProps {
  user: { name?: string; email?: string } | null;
  onLogout: () => void;
}

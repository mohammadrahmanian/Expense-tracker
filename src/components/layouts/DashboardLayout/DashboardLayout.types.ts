import React from "react";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
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

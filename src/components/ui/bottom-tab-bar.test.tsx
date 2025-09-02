import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { userEvent, renderWithRouter } from '@/test/test-utils';
import { mockScreenSize } from '@/test/setup';
import { BottomTabBar } from './bottom-tab-bar';

// Mock react-router-dom's useLocation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BottomTabBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScreenSize(375); // Mobile size by default
  });

  describe('Rendering', () => {
    it('renders all 5 tabs with correct icons and labels', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      // Check all tabs are present
      expect(screen.getByRole('link', { name: /navigate to dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to transactions/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to categories/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to reports/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to profile/i })).toBeInTheDocument();

      // Check labels are visible
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('has proper navigation role and aria-label', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation');
    });

    it('has correct href attributes for all tabs', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      expect(screen.getByRole('link', { name: /navigate to dashboard/i })).toHaveAttribute('href', '/dashboard');
      expect(screen.getByRole('link', { name: /navigate to transactions/i })).toHaveAttribute('href', '/transactions');
      expect(screen.getByRole('link', { name: /navigate to categories/i })).toHaveAttribute('href', '/categories');
      expect(screen.getByRole('link', { name: /navigate to reports/i })).toHaveAttribute('href', '/reports');
      expect(screen.getByRole('link', { name: /navigate to profile/i })).toHaveAttribute('href', '/profile');
    });
  });

  describe('Active State', () => {
    it('shows active state for dashboard route', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
      expect(dashboardLink).toHaveClass('text-indigo-600');
      
      // Other tabs should not be active
      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      expect(transactionsLink).not.toHaveAttribute('aria-current');
      expect(transactionsLink).toHaveClass('text-gray-600');
    });

    it('shows active state for transactions route', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/transactions'] });

      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      expect(transactionsLink).toHaveAttribute('aria-current', 'page');
      expect(transactionsLink).toHaveClass('text-indigo-600');

      // Dashboard should not be active
      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).not.toHaveAttribute('aria-current');
    });

    it('shows active state for categories route', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/categories'] });

      const categoriesLink = screen.getByRole('link', { name: /navigate to categories/i });
      expect(categoriesLink).toHaveAttribute('aria-current', 'page');
      expect(categoriesLink).toHaveClass('text-indigo-600');
    });

    it('shows active state for reports route', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/reports'] });

      const reportsLink = screen.getByRole('link', { name: /navigate to reports/i });
      expect(reportsLink).toHaveAttribute('aria-current', 'page');
      expect(reportsLink).toHaveClass('text-indigo-600');
    });

    it('shows active state for profile route', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/profile'] });

      const profileLink = screen.getByRole('link', { name: /navigate to profile/i });
      expect(profileLink).toHaveAttribute('aria-current', 'page');
      expect(profileLink).toHaveClass('text-indigo-600');
    });
  });

  describe('User Interactions', () => {
    it('handles click navigation properly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      await user.click(transactionsLink);

      // Note: Since we're using renderWithRouter, actual navigation won't happen
      // but we can verify the link is clickable and has correct href
      expect(transactionsLink).toHaveAttribute('href', '/transactions');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      dashboardLink.focus();

      // Tab to next link
      await user.keyboard('{Tab}');
      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      expect(transactionsLink).toHaveFocus();

      // Enter to activate
      await user.keyboard('{Enter}');
      expect(transactionsLink).toHaveAttribute('href', '/transactions');
    });

    it('has proper focus styles', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-inset', 'focus:ring-indigo-500');
    });
  });

  describe('Responsive Behavior', () => {
    it('is visible on mobile breakpoints (< lg)', () => {
      mockScreenSize(768); // Mobile/tablet size
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toHaveClass('lg:hidden');
    });

    it('is hidden on desktop breakpoints (>= lg)', () => {
      mockScreenSize(1024); // Desktop size
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toHaveClass('lg:hidden');
    });

    it('has proper mobile positioning and z-index', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0', 'z-30');
    });

    it('has safe area bottom class for mobile devices', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toHaveClass('safe-area-bottom');
    });
  });

  describe('Theme Support', () => {
    it('has light theme classes by default', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toHaveClass('bg-white', 'border-gray-200');
    });

    it('has dark theme classes', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
      expect(nav).toHaveClass('dark:bg-gray-800', 'dark:border-gray-700');
    });

    it('has proper text colors for light and dark themes', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveClass('text-indigo-600', 'dark:text-indigo-400');

      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      expect(transactionsLink).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });
  });

  describe('Visual Design', () => {
    it('has correct height and spacing', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const tabContainer = screen.getByRole('navigation').querySelector('.flex.h-16');
      expect(tabContainer).toBeInTheDocument();
    });

    it('tabs have minimum touch target size', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveClass('min-h-[44px]');
    });

    it('has transition animations', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveClass('transition-all', 'duration-200', 'ease-in-out');
    });

    it('has hover states', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      expect(transactionsLink).toHaveClass('hover:bg-gray-50', 'dark:hover:bg-gray-700/50');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation');

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-label', 'Navigate to Dashboard');
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('supports screen readers with proper labeling', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      // Each tab should have descriptive aria-label
      expect(screen.getByRole('link', { name: /navigate to dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to transactions/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to categories/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to reports/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /navigate to profile/i })).toBeInTheDocument();
    });

    it('indicates current page to screen readers', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');

      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      expect(transactionsLink).not.toHaveAttribute('aria-current');
    });

    it('has keyboard navigation support', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      // Start from first tab
      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      await user.tab();
      
      // Should be able to navigate through all tabs
      expect(dashboardLink).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('link', { name: /navigate to transactions/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('link', { name: /navigate to categories/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('link', { name: /navigate to reports/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('link', { name: /navigate to profile/i })).toHaveFocus();
    });
  });

  describe('Icon Scaling', () => {
    it('scales active tab icon correctly', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      const icon = dashboardLink.querySelector('svg');
      expect(icon).toHaveClass('scale-110');
    });

    it('does not scale inactive tab icons', () => {
      renderWithRouter(<BottomTabBar />, { initialEntries: ['/dashboard'] });

      const transactionsLink = screen.getByRole('link', { name: /navigate to transactions/i });
      const icon = transactionsLink.querySelector('svg');
      expect(icon).not.toHaveClass('scale-110');
    });
  });
});
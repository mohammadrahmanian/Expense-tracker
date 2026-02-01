# Application Overview

**Application:** Expensio - Personal Expense Tracker
**Type:** Mobile-first PWA (Progressive Web App)
**Version:** 0.0.0

---

## What is Expensio?

Expensio is a personal finance management app that helps users:
- Track income and expenses with categorization
- Visualize spending patterns through reports and charts
- Manage recurring transactions (subscriptions, regular payments)
- Quick-log common expenses via floating action button

---

## Core Features

| Feature | Description | Primary Location |
|---------|-------------|------------------|
| Quick Expense | FAB with predefined categories (Food, Health, Household) | `src/components/ui/quick-expense-modal.tsx` |
| Dashboard | Balance, income, expenses, savings overview | `src/pages/Dashboard.tsx` |
| Transactions | CRUD with filtering, sorting, pagination | `src/pages/Transactions.tsx` |
| Recurring | Automated scheduling (daily/weekly/monthly/yearly) | `src/pages/RecurringTransactions.tsx` |
| Reports | Charts showing spending trends and breakdowns | `src/pages/Reports.tsx` |
| Categories | Custom categories with color coding | `src/pages/Categories.tsx` |

---

## Tech Stack

### Core
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| TypeScript | Type Safety | 5.x |
| Vite | Build Tool & Dev Server | 5.x |

### UI & Styling
| Technology | Purpose |
|------------|---------|
| Tailwind CSS | Utility-first styling |
| Radix UI | Accessible component primitives |
| shadcn/ui | Pre-built component patterns |
| Lucide React / Iconify | Icons |
| Highcharts | Charts and visualizations |

### Data & State
| Technology | Purpose |
|------------|---------|
| TanStack Query | Server state (API data caching, mutations) |
| React Context | Global UI state (Auth, Currency, Sidebar) |
| React Hook Form + Zod | Form handling and validation |
| Axios | HTTP client with interceptors |

### Testing
| Technology | Purpose |
|------------|---------|
| Vitest | Test runner |
| Testing Library | Component testing |

---

## Supported Currencies

| Code | Symbol | Format Example |
|------|--------|----------------|
| USD | $ | $1,234.56 |
| EUR | € | €1.234,56 |

Currency formatting handled by `src/contexts/CurrencyContext.tsx`.

---

## Navigation Structure

### Mobile (< 768px)
- Bottom tab bar with 4 tabs: Dashboard, Transactions, Reports, More
- Floating action button for quick expense entry
- No sidebar

### Desktop (≥ 768px)
- Collapsible sidebar navigation
- No bottom tab bar
- Sidebar state persisted to localStorage

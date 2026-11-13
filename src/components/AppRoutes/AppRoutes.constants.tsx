import { Categories } from "@/pages/Categories";
import { Dashboard } from "@/pages/Dashboard";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/Login";
import More from "@/pages/More";
import NotFound from "@/pages/NotFound";
import OAuthConsent from "@/pages/OAuthConsent";
import Profile from "@/pages/Profile";
import RecurringTransactionDetailPage from "@/pages/RecurringTransactionDetailPage";
import RecurringTransactionFormPage from "@/pages/RecurringTransactionFormPage";
import RecurringTransactions from "@/pages/RecurringTransactions";
import Register from "@/pages/Register";
import { Reports } from "@/pages/Reports";
import { Transactions } from "@/pages/Transactions";
import { type RouteConfig } from "./AppRoutes.types";

export const ROUTES: RouteConfig[] = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/oauth/consent", element: <OAuthConsent /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
    protected: true,
    boundaryName: "DashboardPage",
  },
  {
    path: "/transactions",
    element: <Transactions />,
    protected: true,
    boundaryName: "TransactionsPage",
  },
  {
    path: "/categories",
    element: <Categories />,
    protected: true,
    boundaryName: "CategoriesPage",
  },
  {
    path: "/recurring-transactions",
    element: <RecurringTransactions />,
    protected: true,
    boundaryName: "RecurringTransactionsPage",
  },
  {
    path: "/recurring-transactions/new",
    element: <RecurringTransactionFormPage />,
    protected: true,
    boundaryName: "RecurringTransactionNewPage",
  },
  {
    path: "/recurring-transactions/:id/edit",
    element: <RecurringTransactionFormPage />,
    protected: true,
    boundaryName: "RecurringTransactionEditPage",
  },
  {
    path: "/recurring-transactions/:id",
    element: <RecurringTransactionDetailPage />,
    protected: true,
    boundaryName: "RecurringTransactionDetailPage",
  },
  {
    path: "/reports",
    element: <Reports />,
    protected: true,
    boundaryName: "ReportsPage",
  },
  {
    path: "/profile",
    element: <Profile />,
    protected: true,
    boundaryName: "ProfilePage",
  },
  {
    path: "/more",
    element: <More />,
    protected: true,
    boundaryName: "MorePage",
  },
  { path: "*", element: <NotFound /> },
];

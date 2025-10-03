export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: "INCOME" | "EXPENSE";
  userId: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryId: string;
  category?: Category;
  userId: string;
  isRecurring?: boolean;
  recurrenceFrequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  categoryId: string;
  category?: Category;
  amount: number;
  period: "monthly" | "yearly";
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isInitializingAuth: boolean;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySaving: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  description?: string;
  nextOccurrence: string;
  categoryId: string;
  category?: Category;
  recurrenceFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

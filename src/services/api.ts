import { Transaction, Category, Budget, DashboardStats } from "@/types";

// Mock data storage using localStorage for demo purposes
// In a real app, these would be actual API calls to your backend

export const transactionsService = {
  getAll: (): Transaction[] => {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  },

  create: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Transaction => {
    const transactions = transactionsService.getAll();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    return newTransaction;
  },

  update: (id: string, updates: Partial<Transaction>): Transaction => {
    const transactions = transactionsService.getAll();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Transaction not found");

    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date(),
    };
    localStorage.setItem("transactions", JSON.stringify(transactions));
    return transactions[index];
  },

  delete: (id: string): void => {
    const transactions = transactionsService.getAll();
    const filtered = transactions.filter((t) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(filtered));
  },
};

export const categoriesService = {
  getAll: (): Category[] => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize with default categories
    const defaultCategories: Category[] = [
      {
        id: "1",
        name: "Food & Dining",
        color: "#FF6B6B",
        type: "expense",
        userId: "1",
      },
      {
        id: "2",
        name: "Transportation",
        color: "#4ECDC4",
        type: "expense",
        userId: "1",
      },
      {
        id: "3",
        name: "Shopping",
        color: "#45B7D1",
        type: "expense",
        userId: "1",
      },
      {
        id: "4",
        name: "Entertainment",
        color: "#96CEB4",
        type: "expense",
        userId: "1",
      },
      {
        id: "5",
        name: "Bills & Utilities",
        color: "#FFEAA7",
        type: "expense",
        userId: "1",
      },
      {
        id: "6",
        name: "Healthcare",
        color: "#DDA0DD",
        type: "expense",
        userId: "1",
      },
      {
        id: "7",
        name: "Salary",
        color: "#00B894",
        type: "income",
        userId: "1",
      },
      {
        id: "8",
        name: "Freelance",
        color: "#00CEC9",
        type: "income",
        userId: "1",
      },
      {
        id: "9",
        name: "Investments",
        color: "#6C5CE7",
        type: "income",
        userId: "1",
      },
      {
        id: "10",
        name: "Other Income",
        color: "#A29BFE",
        type: "income",
        userId: "1",
      },
    ];

    localStorage.setItem("categories", JSON.stringify(defaultCategories));
    return defaultCategories;
  },

  create: (category: Omit<Category, "id">): Category => {
    const categories = categoriesService.getAll();
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    categories.push(newCategory);
    localStorage.setItem("categories", JSON.stringify(categories));
    return newCategory;
  },

  update: (id: string, updates: Partial<Category>): Category => {
    const categories = categoriesService.getAll();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem("categories", JSON.stringify(categories));
    return categories[index];
  },

  delete: (id: string): void => {
    const categories = categoriesService.getAll();
    const filtered = categories.filter((c) => c.id !== id);
    localStorage.setItem("categories", JSON.stringify(filtered));
  },
};

export const budgetsService = {
  getAll: (): Budget[] => {
    const stored = localStorage.getItem("budgets");
    return stored ? JSON.parse(stored) : [];
  },

  create: (budget: Omit<Budget, "id">): Budget => {
    const budgets = budgetsService.getAll();
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    budgets.push(newBudget);
    localStorage.setItem("budgets", JSON.stringify(budgets));
    return newBudget;
  },

  update: (id: string, updates: Partial<Budget>): Budget => {
    const budgets = budgetsService.getAll();
    const index = budgets.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Budget not found");

    budgets[index] = { ...budgets[index], ...updates };
    localStorage.setItem("budgets", JSON.stringify(budgets));
    return budgets[index];
  },

  delete: (id: string): void => {
    const budgets = budgetsService.getAll();
    const filtered = budgets.filter((b) => b.id !== id);
    localStorage.setItem("budgets", JSON.stringify(filtered));
  },
};

export const dashboardService = {
  getStats: (): DashboardStats => {
    const transactions = transactionsService.getAll();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      currentBalance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings: monthlyIncome - monthlyExpenses,
    };
  },
};

/**
 * Centralized Error Messages
 *
 * All user-facing error messages are defined here for consistency and easy maintenance.
 * Messages are grouped by feature area.
 */

export const ERROR_MESSAGES = {
  // Network errors
  NETWORK: {
    NO_RESPONSE:
      "Unable to connect to the server. Please check your internet connection.",
    TIMEOUT: "Request timed out. Please try again.",
    OFFLINE: "You appear to be offline. Please check your internet connection.",
  },

  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    LOGIN_FAILED: "Login failed. Please try again.",
    REGISTER_FAILED: "Registration failed. Please try again.",
    LOGOUT_FAILED: "Logout failed. Please try again.",
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: "Please fill in all required fields.",
    INVALID_AMOUNT: "Please enter a valid amount.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_DATE: "Please select a valid date.",
  },

  // Transaction errors
  TRANSACTIONS: {
    CREATE_FAILED: "Failed to create transaction. Please try again.",
    UPDATE_FAILED: "Failed to update transaction. Please try again.",
    DELETE_FAILED: "Failed to delete transaction. Please try again.",
    LOAD_FAILED: "Failed to load transactions. Please try again.",
    FETCH_FAILED: "Failed to fetch transactions. Please try again.",
  },

  // Category errors
  CATEGORIES: {
    CREATE_FAILED: "Failed to create category. Please try again.",
    UPDATE_FAILED: "Failed to update category. Please try again.",
    DELETE_FAILED: "Failed to delete category. Please try again.",
    LOAD_FAILED: "Failed to load categories. Please try again.",
    FETCH_FAILED: "Failed to fetch categories. Please try again.",
  },

  // Dashboard errors
  DASHBOARD: {
    STATS_FAILED: "Failed to load dashboard statistics. Please try again.",
    CATEGORY_EXPENSES_FAILED:
      "Failed to load expense breakdown. Please try again.",
    FETCH_FAILED: "Failed to fetch dashboard data. Please try again.",
  },

  // Recurring transactions
  RECURRING: {
    CREATE_FAILED: "Failed to create recurring transaction. Please try again.",
    UPDATE_FAILED: "Failed to update recurring transaction. Please try again.",
    DELETE_FAILED: "Failed to delete recurring transaction. Please try again.",
    TOGGLE_FAILED: "Failed to toggle recurring transaction. Please try again.",
    LOAD_FAILED: "Failed to load recurring transactions. Please try again.",
    FETCH_FAILED: "Failed to fetch recurring transactions. Please try again.",
  },

  // Reports errors
  REPORTS: {
    LOAD_FAILED: "Failed to load reports. Please try again.",
    FETCH_FAILED: "Failed to fetch reports. Please try again.",
  },

  // Budget errors (for future use)
  BUDGETS: {
    CREATE_FAILED: "Failed to create budget. Please try again.",
    UPDATE_FAILED: "Failed to update budget. Please try again.",
    DELETE_FAILED: "Failed to delete budget. Please try again.",
    LOAD_FAILED: "Failed to load budgets. Please try again.",
  },

  // Generic errors
  GENERIC: {
    UNKNOWN: "An unexpected error occurred. Please try again.",
    SERVER_ERROR: "Server error. Please try again later or contact support.",
  },
} as const;

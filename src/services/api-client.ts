import axios, { AxiosInstance, AxiosResponse } from "axios";

// Navigation singleton for use outside React components
let navigationCallback: ((path: string) => void) | null = null;

export const setNavigationCallback = (callback: (path: string) => void) => {
  navigationCallback = callback;
};

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL environment variable is required. Please set it in your .env file (e.g., VITE_API_BASE_URL=http://localhost:4000/api)",
  );
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable sending/receiving cookies in cross-origin requests
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      // Only redirect if not already on auth pages
      if (
        window.location.pathname !== "/" &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        if (navigationCallback) {
          navigationCallback("/login");
        } else {
          // Fallback to window.location if navigation callback is not set
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };

import axios, { AxiosInstance } from "axios";

// The self-hosted OAuth 2.1 authorization server is registered at the API
// **host root** (no `/api` prefix) because @platformatic/mcp advertises
// `/.well-known/oauth-protected-resource` at the origin root and the whole
// discovery chain breaks if the AS endpoints sit under a path. The normal
// `apiClient` uses `VITE_API_BASE_URL` which includes the `/api` prefix, so we
// need a dedicated instance pointed at the origin instead.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL environment variable is required. Please set it in your .env file (e.g., VITE_API_BASE_URL=http://localhost:4000/api)",
  );
}

// Resolve against the current origin so a relative base (e.g. "/api" in dev or
// tests) still produces a valid origin; absolute bases (the real cross-subdomain
// `https://api-*.expensio.me/api`) resolve to their own origin unchanged.
const OAUTH_BASE_URL = new URL(API_BASE_URL, window.location.origin).origin;

// Deliberately no global 401 redirect interceptor here: the consent page handles
// a decision 401 locally (route through login while preserving request_id).
const oauthClient: AxiosInstance = axios.create({
  baseURL: OAUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // send the SameSite=Lax session cookie
});

export { oauthClient };

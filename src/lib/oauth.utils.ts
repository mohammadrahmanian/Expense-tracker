import axios from "axios";

/**
 * Validate a `returnTo` path before navigating to it after login.
 *
 * Guards against open-redirect: only same-origin, single-segment-rooted paths
 * are allowed. Rejects protocol-relative (`//evil.com`), absolute URLs
 * (`http://…`), and anything not starting with a single `/`.
 */
export const isSafeReturnTo = (value: string | null | undefined): boolean => {
  if (!value) return false;
  // Must start with exactly one leading slash (rules out "//host" and "http://").
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  // Backslashes are normalized to slashes by some browsers — reject them too.
  if (value.includes("\\")) return false;
  return true;
};

/** Build a `/login?returnTo=…` path that returns to `target` after login. */
export const buildLoginRedirect = (target: string): string =>
  `/login?returnTo=${encodeURIComponent(target)}`;

/** Extract the HTTP status code from an axios error, if present. */
export const getErrorStatus = (error: unknown): number | undefined => {
  if (axios.isAxiosError(error)) return error.response?.status;
  return undefined;
};

/** Extract the backend `error` code from an axios error body, if present. */
export const getErrorCode = (error: unknown): string | undefined => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    return data?.error;
  }
  return undefined;
};

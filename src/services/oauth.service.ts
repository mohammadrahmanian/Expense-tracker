import { handleApiError } from "@/lib/error-handling";
import { OAuthConsentInfo, OAuthDecisionResponse } from "@/types";
import { oauthClient } from "./oauth-client";

export const oauthService = {
  /**
   * Fetch consent details for a pending authorization request.
   *
   * Unauthenticated endpoint, gated only by the unguessable `requestId`.
   * Returns 404 (`request_not_found`) when the request is unknown, expired, or
   * already consumed — the page treats this as the "expired/bad link" state.
   */
  getConsentInfo: async (requestId: string): Promise<OAuthConsentInfo> => {
    try {
      const response = await oauthClient.get<OAuthConsentInfo>(
        "/oauth/authorize/info",
        { params: { request_id: requestId } },
      );
      return response.data;
    } catch (error) {
      // The page renders explicit UI for the 404/error states.
      handleApiError(
        error,
        { action: "fetch oauth consent info", feature: "OAUTH" },
        { showToast: false },
      );
      throw error;
    }
  },

  /**
   * Submit the user's approve/deny decision for a pending authorization request.
   *
   * Authenticated by the existing session cookie. Approve and deny share the
   * same 200 `{ redirect_to }` shape — the "denied" semantics live inside the
   * URL (`?error=access_denied`), not in the HTTP status.
   */
  submitDecision: async (
    requestId: string,
    approve: boolean,
  ): Promise<OAuthDecisionResponse> => {
    try {
      const response = await oauthClient.post<OAuthDecisionResponse>(
        "/oauth/authorize/decision",
        { request_id: requestId, approve },
      );
      return response.data;
    } catch (error) {
      handleApiError(
        error,
        { action: "submit oauth decision", feature: "OAUTH" },
        { showToast: false },
      );
      throw error;
    }
  },
};

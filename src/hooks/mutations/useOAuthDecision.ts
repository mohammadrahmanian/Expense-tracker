import { useMutation } from "@tanstack/react-query";
import { oauthService } from "@/services/api";

type OAuthDecisionVariables = {
  requestId: string;
  approve: boolean;
};

/**
 * Hook for submitting the user's OAuth approve/deny decision.
 *
 * Both approve and deny resolve to `{ redirect_to }`; the caller navigates the
 * browser there via `window.location.assign`. Error handling lives in the
 * consent page so it can branch on status (401 → re-login preserving
 * `request_id`, 400 `request_expired` → restart). Logging/Sentry already happen
 * in the service layer.
 *
 * @returns Mutation function and status
 */
export function useOAuthDecision() {
  return useMutation({
    mutationFn: ({ requestId, approve }: OAuthDecisionVariables) =>
      oauthService.submitDecision(requestId, approve),
  });
}

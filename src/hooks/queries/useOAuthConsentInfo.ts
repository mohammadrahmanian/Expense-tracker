import { useQuery } from "@tanstack/react-query";
import { oauthService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

/**
 * Hook for fetching OAuth consent details for a pending authorization request.
 *
 * The info endpoint is unauthenticated and gated only by `requestId`. A 404
 * (`request_not_found`) means the request is unknown/expired — do not retry it.
 *
 * @param requestId - Opaque handle for the pending authorization request
 * @returns Query result with `{ clientName, scope }`
 */
export function useOAuthConsentInfo(requestId: string | null) {
  return useQuery({
    queryKey: queryKeys.oauth.consentInfo(requestId ?? ""),
    queryFn: () => oauthService.getConsentInfo(requestId as string),
    enabled: !!requestId,
    retry: false,
    staleTime: 0,
  });
}

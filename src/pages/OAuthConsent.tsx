import { type FC } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { OAuthConsentContent } from "@/components/oauth/OAuthConsentContent";
import { useAuth } from "@/contexts/AuthContext";
import { useOAuthDecision } from "@/hooks/mutations/useOAuthDecision";
import { useOAuthConsentInfo } from "@/hooks/queries/useOAuthConsentInfo";
import { buildLoginRedirect, getErrorCode, getErrorStatus } from "@/lib/oauth.utils";

const OAuthConsent: FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isInitializingAuth } = useAuth();

  const requestId = searchParams.get("request_id");
  const loginRedirect = buildLoginRedirect(location.pathname + location.search);
  const info = useOAuthConsentInfo(user ? requestId : null);
  const decision = useOAuthDecision();

  const handleDecision = (approve: boolean) => {
    if (!requestId) return;
    decision.mutate(
      { requestId, approve },
      {
        onSuccess: (data) => window.location.assign(data.redirect_to),
        onError: (error) => {
          // Session expired mid-flow → re-login, preserving request_id.
          if (getErrorStatus(error) === 401) {
            navigate(loginRedirect, { replace: true });
          }
        },
      },
    );
  };

  // Not authenticated → send through normal login, returning here afterward.
  if (!isInitializingAuth && !user) {
    return <Navigate to={loginRedirect} replace />;
  }

  const decisionFailed =
    decision.isError && getErrorStatus(decision.error) !== 401;

  return (
    <AuthLayout
      title="Connect to Expensio"
      subtitle="Review and approve access for an external app"
    >
      <OAuthConsentContent
        isInitializingAuth={isInitializingAuth}
        hasRequestId={!!requestId}
        infoLoading={info.isLoading}
        infoError={info.isError}
        decisionFailed={decisionFailed}
        decisionExpired={getErrorCode(decision.error) === "request_expired"}
        clientName={info.data?.clientName ?? null}
        scope={info.data?.scope ?? null}
        isSubmitting={decision.isPending}
        pendingAction={
          decision.isPending
            ? decision.variables?.approve
              ? "approve"
              : "deny"
            : null
        }
        onApprove={() => handleDecision(true)}
        onDeny={() => handleDecision(false)}
      />
    </AuthLayout>
  );
};

export default OAuthConsent;

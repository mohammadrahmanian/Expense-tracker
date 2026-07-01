import { type FC } from "react";
import { OAuthConsentCard } from "@/components/oauth/OAuthConsentCard";
import { OAuthConsentStatus } from "@/components/oauth/OAuthConsentStatus";

type OAuthConsentContentProps = {
  isInitializingAuth: boolean;
  hasRequestId: boolean;
  infoLoading: boolean;
  infoError: boolean;
  decisionFailed: boolean;
  decisionExpired: boolean;
  clientName: string | null;
  scope: string | null;
  isSubmitting: boolean;
  pendingAction: "approve" | "deny" | null;
  onApprove: () => void;
  onDeny: () => void;
};

export const OAuthConsentContent: FC<OAuthConsentContentProps> = ({
  isInitializingAuth,
  hasRequestId,
  infoLoading,
  infoError,
  decisionFailed,
  decisionExpired,
  clientName,
  scope,
  isSubmitting,
  pendingAction,
  onApprove,
  onDeny,
}) => {
  if (isInitializingAuth) {
    return <OAuthConsentStatus variant="loading" title="Checking your session…" />;
  }
  if (!hasRequestId) {
    return (
      <OAuthConsentStatus
        variant="error"
        title="Invalid authorization request"
        description="This link is missing required information. Start the connection again from the app you came from."
      />
    );
  }
  if (infoLoading) {
    return <OAuthConsentStatus variant="loading" title="Loading request…" />;
  }
  if (infoError) {
    return (
      <OAuthConsentStatus
        variant="error"
        title="This request has expired or is invalid"
        description="Authorization requests are short-lived. Start the connection again from the app you came from."
      />
    );
  }
  if (decisionFailed) {
    return (
      <OAuthConsentStatus
        variant="error"
        title={decisionExpired ? "This request has expired" : "Something went wrong"}
        description={
          decisionExpired
            ? "Start the connection again from the app you came from."
            : "We couldn't process your decision. Please try again."
        }
      />
    );
  }
  return (
    <OAuthConsentCard
      clientName={clientName}
      scope={scope}
      isSubmitting={isSubmitting}
      pendingAction={pendingAction}
      onApprove={onApprove}
      onDeny={onDeny}
    />
  );
};

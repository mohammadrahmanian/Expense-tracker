import { type FC, type ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

type OAuthConsentStatusProps = {
  variant: "loading" | "error";
  title: string;
  description?: string;
  children?: ReactNode;
};

export const OAuthConsentStatus: FC<OAuthConsentStatusProps> = ({
  variant,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      {variant === "loading" ? (
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

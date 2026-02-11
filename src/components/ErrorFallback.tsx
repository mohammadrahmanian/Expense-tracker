import { useMemo, useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw, Sparkles } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: React.ErrorInfo | null;
  resetError: () => void;
  onGoHome?: () => void;
  title?: string;
  subtitle?: string;
  boundaryName?: string;
  variant?: "app" | "page" | "component";
}

const variantCopy: Record<
  NonNullable<ErrorFallbackProps["variant"]>,
  {
    title: string;
    subtitle: string;
  }
> = {
  app: {
    title: "We hit a cosmic pothole",
    subtitle: "The whole caravan paused. Let's get you rolling again.",
  },
  page: {
    title: "This page tripped over its own feet",
    subtitle: "A quick refresh should smooth things out.",
  },
  component: {
    title: "A widget went wobbly",
    subtitle: "We quarantined it so the rest keeps running.",
  },
};

export function ErrorFallback({
  error,
  errorInfo,
  resetError,
  onGoHome,
  title,
  subtitle,
  boundaryName,
  variant = "app",
}: ErrorFallbackProps) {
  const [showDuckTip, setShowDuckTip] = useState(false);

  const resolvedTitle = title ?? variantCopy[variant].title;
  const resolvedSubtitle = subtitle ?? variantCopy[variant].subtitle;

  const detail = useMemo(() => {
    if (!import.meta.env.DEV || !error) return null;
    return error.stack || error.message;
  }, [error]);

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border/60 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:bg-slate-900/80">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {boundaryName
                    ? `Boundary: ${boundaryName}`
                    : "Error boundary"}
                </p>
                <h2 className="text-xl font-semibold text-foreground">
                  {resolvedTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {resolvedSubtitle}
                </p>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                <span className="inline-flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Safe mode
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={resetError} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Try again
              </Button>
              {onGoHome && (
                <Button variant="outline" onClick={onGoHome} className="gap-2">
                  <Home className="h-4 w-4" /> Go to dashboard
                </Button>
              )}
              <button
                type="button"
                onClick={() => setShowDuckTip((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:from-emerald-500/20 hover:via-sky-500/20 hover:to-indigo-500/20 dark:text-emerald-200"
              >
                <span className="text-lg" role="img" aria-label="rubber duck">
                  🦆
                </span>
                Duck debug mode
              </button>
            </div>

            {showDuckTip && (
              <div className="mt-3 rounded-xl border border-dashed border-emerald-400/40 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-inner dark:border-emerald-300/30 dark:bg-emerald-900/40 dark:text-emerald-100">
                <p className="font-medium">The rubber duck whispers:</p>
                <p className="mt-1 text-emerald-800 dark:text-emerald-50">
                  "When in doubt, refresh out. If it persists, tell the humans."
                </p>
              </div>
            )}

            {detail && (
              <details className="group mt-3 rounded-lg border border-muted/40 bg-muted/20 p-3 text-xs text-muted-foreground">
                <summary className="cursor-pointer font-medium text-foreground group-open:mb-2">
                  Dev details
                </summary>
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                  {detail}
                </pre>
                {errorInfo?.componentStack && (
                  <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;

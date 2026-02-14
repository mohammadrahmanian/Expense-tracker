import React from "react";
import * as Sentry from "@sentry/react";
import ErrorFallback from "@/components/ErrorFallback";

type BoundaryVariant = "app" | "page" | "component";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  name?: string;
  variant?: BoundaryVariant;
  /** Optional handler for navigating home */
  onGoHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });

    Sentry.captureException(error, {
      extra: {
        boundary: this.props.name || "UnnamedBoundary",
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = () => {
    // Requirement: Try again should hard reload the app
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.handleReset}
          onGoHome={this.props.onGoHome}
          boundaryName={this.props.name}
          variant={this.props.variant}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

export function PageErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundary {...props} variant="page" />;
}

export function ComponentErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundary {...props} variant="component" />;
}

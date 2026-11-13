import { type FC, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PageErrorBoundary } from "@/components/ErrorBoundary";

type PageBoundaryProps = {
  name: string;
  children: ReactNode;
};

export const PageBoundary: FC<PageBoundaryProps> = ({ name, children }) => {
  const navigate = useNavigate();

  return (
    <PageErrorBoundary name={name} onGoHome={() => navigate("/dashboard")}>
      {children}
    </PageErrorBoundary>
  );
};

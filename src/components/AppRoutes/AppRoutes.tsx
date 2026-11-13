import { type FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ROUTES } from "./AppRoutes.constants";
import { PageBoundary } from "./PageBoundary";

export const AppRoutes: FC = () => (
  <Routes>
    {ROUTES.map(({ path, element, protected: isProtected, boundaryName }) => (
      <Route
        key={path}
        path={path}
        element={
          isProtected ? (
            <ProtectedRoute>
              <PageBoundary name={boundaryName!}>{element}</PageBoundary>
            </ProtectedRoute>
          ) : (
            element
          )
        }
      />
    ))}
  </Routes>
);

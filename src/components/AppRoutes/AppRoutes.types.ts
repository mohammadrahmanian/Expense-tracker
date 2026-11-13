import { type ReactNode } from "react";

export type RouteConfig = {
  path: string;
  element: ReactNode;
  protected?: boolean;
  boundaryName?: string;
};

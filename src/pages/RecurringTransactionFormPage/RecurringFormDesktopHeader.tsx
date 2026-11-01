import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type RecurringFormDesktopHeaderProps = {
  mode: "create" | "edit";
};

export const RecurringFormDesktopHeader: FC<
  RecurringFormDesktopHeaderProps
> = ({ mode }) => (
  <div className="mb-6 flex flex-col gap-1">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/recurring-transactions">Recurring</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{mode === "edit" ? "Edit" : "New"}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <h1 className="text-2xl font-bold tracking-tight text-foreground">
      {mode === "edit"
        ? "Edit recurring transaction"
        : "New recurring transaction"}
    </h1>
  </div>
);

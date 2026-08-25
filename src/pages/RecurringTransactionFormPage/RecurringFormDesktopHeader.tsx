import { type FC } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  formId: string;
  isPending: boolean;
  isDisabled: boolean;
  onCancel: () => void;
};

export const RecurringFormDesktopHeader: FC<RecurringFormDesktopHeaderProps> = ({
  mode,
  formId,
  isPending,
  isDisabled,
  onCancel,
}) => (
  <div className="mb-6 flex items-center justify-between gap-4">
    <div className="flex flex-col gap-1">
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
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button type="submit" form={formId} disabled={isDisabled}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "edit" ? "Saving..." : "Creating..."}
          </>
        ) : mode === "edit" ? (
          "Save changes"
        ) : (
          "Save recurring"
        )}
      </Button>
    </div>
  </div>
);

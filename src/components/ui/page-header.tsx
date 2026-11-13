import { type FC, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionAlwaysVisible?: boolean;
  backTo?: string;
  trailing?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  descriptionAlwaysVisible = false,
  backTo,
  trailing,
}) => (
  <header
    className="border-b border-neutral-200 bg-surface dark:border-neutral-800 dark:bg-neutral-900 lg:border-b-0 lg:bg-transparent lg:dark:bg-transparent"
    style={{ paddingTop: "env(safe-area-inset-top)" }}
  >
    <div className="flex h-[72px] items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center">
        {backTo && (
          <Link
            to={backTo}
            aria-label="Back"
            className="-ml-1 mr-2 rounded-lg p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
          >
            <ChevronLeft className="h-6 w-6 text-gold-500" />
          </Link>
        )}
        <div>
          <h1 className="text-h2 text-neutral-900 dark:text-white">{title}</h1>
          {description && (
            <p
              className={cn(
                "mt-0.5 text-caption text-neutral-500",
                !descriptionAlwaysVisible && "hidden lg:block",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {trailing && <div className="flex items-center gap-3">{trailing}</div>}
    </div>
  </header>
);

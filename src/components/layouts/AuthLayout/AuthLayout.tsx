import { type FC, type ReactNode } from "react";

import { BrandPanel } from "./BrandPanel";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-neutral-900">
      <BrandPanel />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-12">
        <div className="mx-auto flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[28px] font-bold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

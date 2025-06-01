import React from "react";
import { Card } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">$</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ExpenseTracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Take control of your finances
          </p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};

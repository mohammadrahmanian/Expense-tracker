import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface MoreMenuItem {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MoreMenuItem[] = [
  {
    name: "Categories",
    description: "Organize your expense categories",
    href: "/categories",
    icon: <Icon icon="hugeicons:folder-02" className="h-6 w-6" />,
  },
  {
    name: "Recurring Transactions",
    description: "Manage recurring income and expenses",
    href: "/recurring-transactions",
    icon: <Icon icon="hugeicons:repeat" className="h-6 w-6" />,
  },
];

const More: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        {menuItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="mb-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default More;

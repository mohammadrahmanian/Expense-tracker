import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { UserProfileMenuProps } from "../../DashboardLayout.types";

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  onLogout,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <button className="relative h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || "user@example.com"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut } from "lucide-react";
import { type FC } from "react";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const formatDisplayName = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
};

type SidebarUserProfileProps = {
  collapsed: boolean;
};

export const SidebarUserProfile: FC<SidebarUserProfileProps> = ({
  collapsed,
}) => {
  const { user, logout } = useAuth();
  const name = user?.name || "User";
  const email = user?.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
            collapsed ? "justify-center p-2" : "gap-2.5 px-2 py-2.5",
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-gold-500 text-white font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-body font-semibold text-neutral-600 dark:text-neutral-50 truncate">
                  {formatDisplayName(name)}
                </p>
                <p className="text-caption text-neutral-500 truncate">{email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-48">
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-danger-500 focus:text-danger-500"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

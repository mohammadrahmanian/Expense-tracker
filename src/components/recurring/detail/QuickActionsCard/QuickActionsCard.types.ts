import type { LucideIcon } from "lucide-react";

export type ActionRow = {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

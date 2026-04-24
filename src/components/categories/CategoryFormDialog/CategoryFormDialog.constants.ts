import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Car,
  Coffee,
  Dumbbell,
  Gift,
  Heart,
  Home,
  Plane,
  Receipt,
  ShoppingBag,
  Tv,
  Utensils,
} from "lucide-react";

export type CategoryIconOption = {
  name: string;
  Icon: LucideIcon;
};

export const ICON_OPTIONS: CategoryIconOption[] = [
  { name: "utensils", Icon: Utensils },
  { name: "car", Icon: Car },
  { name: "shopping-bag", Icon: ShoppingBag },
  { name: "receipt", Icon: Receipt },
  { name: "house", Icon: Home },
  { name: "heart", Icon: Heart },
  { name: "tv", Icon: Tv },
  { name: "plane", Icon: Plane },
  { name: "briefcase", Icon: Briefcase },
  { name: "book-open", Icon: BookOpen },
  { name: "coffee", Icon: Coffee },
  { name: "gift", Icon: Gift },
  { name: "dumbbell", Icon: Dumbbell },
];

export const COLOR_OPTIONS = [
  "#D4600C",
  "#E89F2A",
  "#6E8E3C",
  "#3F8E7F",
  "#4A7FB8",
  "#7E5FB8",
  "#C85B8E",
  "#6B5B4F",
  "#3F3F47",
] as const;

export const DEFAULT_CATEGORY_FORM = {
  name: "",
  type: "EXPENSE" as const,
  color: COLOR_OPTIONS[0],
  icon: "utensils",
  parentId: null as string | null,
  budgetAmount: null as number | null,
};

export const ICON_BY_NAME = Object.fromEntries(
  ICON_OPTIONS.map(({ name, Icon }) => [name, Icon]),
) as Record<string, LucideIcon>;

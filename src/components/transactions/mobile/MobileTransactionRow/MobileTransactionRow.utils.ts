import {
  Briefcase,
  Car,
  CircleDollarSign,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Plane,
  ShoppingCart,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Width in px of the revealed actions area. Matches two `w-20` buttons in `MobileTransactionRowActions`. */
export const SWIPE_ACTIONS_WIDTH = 160;

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  groceries: ShoppingCart,
  salary: Briefcase,
  utilities: Zap,
  housing: Home,
  rent: Home,
  transport: Car,
  transportation: Car,
  health: Heart,
  healthcare: Heart,
  education: GraduationCap,
  food: Utensils,
  dining: Utensils,
  travel: Plane,
  gifts: Gift,
};

export const getCategoryIcon = (categoryName: string): LucideIcon =>
  CATEGORY_ICON_MAP[categoryName.toLowerCase()] ?? CircleDollarSign;

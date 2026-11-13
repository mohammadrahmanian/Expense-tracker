export const dotSizeMap = {
  sm: "h-[5px] w-[5px]",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
} as const;

export const dotColorMap: Record<string, string> = {
  default: "bg-gold-500",
  secondary: "bg-neutral-500",
  destructive: "bg-danger-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  info: "bg-info-500",
  outline: "bg-neutral-400",
  "ghost-success": "border border-success-500",
  "ghost-warning": "border border-warning-500",
  "ghost-danger": "border border-danger-500",
  "ghost-info": "border border-info-500",
  "ghost-neutral": "border border-neutral-500",
  "ghost-primary": "border border-gold-500",
};

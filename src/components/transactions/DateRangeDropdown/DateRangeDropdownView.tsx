import { type FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DatePreset } from "@/lib/transactions.utils";
import { DateRangeTrigger } from "./DateRangeTrigger";
import { DateRangeDesktopPanel } from "./DateRangeDesktopPanel";
import { DateRangeMobileSheet } from "./DateRangeMobileSheet";
import type { DateRangePanelProps } from "./DateRangeDropdown.utils";

type DateRangeDropdownViewProps = {
  isLargeScreen: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "default" | "pill";
  label: string;
  preset: DatePreset;
  panelProps: DateRangePanelProps;
  onBack: () => void;
};

export const DateRangeDropdownView: FC<DateRangeDropdownViewProps> = ({
  isLargeScreen,
  open,
  onOpenChange,
  variant,
  label,
  preset,
  panelProps,
  onBack,
}) => {
  const trigger = (
    <DateRangeTrigger
      variant={variant}
      label={label}
      open={open}
      preset={preset}
    />
  );

  if (isLargeScreen) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto p-0"
          collisionPadding={16}
        >
          <DateRangeDesktopPanel {...panelProps} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[90dvh]">
        <div className="overflow-y-auto pb-4">
          <DateRangeMobileSheet {...panelProps} onBack={onBack} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

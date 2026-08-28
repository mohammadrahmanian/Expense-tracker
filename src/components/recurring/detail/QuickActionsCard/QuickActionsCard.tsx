import { type FC } from "react";
import { CalendarOff, Pause, Play, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { QuickActionsRow } from "./QuickActionsRow";
import type { ActionRow } from "./QuickActionsCard.types";
import type { RecurringStatus } from "@/types";

type QuickActionsCardProps = {
  status: RecurringStatus;
  onPause: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const QuickActionsCard: FC<QuickActionsCardProps> = ({
  status,
  onPause,
  onEdit,
  onDelete,
  isToggling,
  isDeleting,
}) => {
  const rows: ActionRow[] = [
    ...(status !== "ended"
      ? [
          {
            key: "pause",
            icon: status === "paused" ? Play : Pause,
            title: status === "paused" ? "Resume schedule" : "Pause schedule",
            subtitle:
              status === "paused"
                ? "Continue future runs"
                : "Stop future runs until resumed",
            onClick: onPause,
            disabled: isToggling,
          },
        ]
      : []),
    {
      key: "end",
      icon: CalendarOff,
      title: "End on a date",
      subtitle: "Set a final occurrence",
      onClick: onEdit,
    },
    {
      key: "delete",
      icon: Trash2,
      title: "Delete schedule",
      subtitle: "Keeps past transactions",
      onClick: onDelete,
      danger: true,
      disabled: isDeleting,
    },
  ];

  return (
    <Card className="flex flex-col gap-1 p-5">
      <h2 className="mb-2 text-[11px] font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
        QUICK ACTIONS
      </h2>
      {rows.map((row) => (
        <QuickActionsRow key={row.key} row={row} />
      ))}
    </Card>
  );
};

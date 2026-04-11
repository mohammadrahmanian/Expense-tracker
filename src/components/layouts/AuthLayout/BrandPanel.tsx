import { type FC } from "react";

const STATS = [
  { value: "50K+", label: "Users" },
  { value: "$2.4M", label: "Tracked" },
  { value: "4.9\u2605", label: "Rating" },
] as const;

export const BrandPanel: FC = () => {
  return (
    <div className="hidden lg:flex w-[400px] shrink-0 flex-col justify-between bg-gold-500 p-12 dark:bg-gold-600">
      <div className="flex flex-col gap-3">
        <div className="h-1 w-8 rounded-sm bg-white" />
        <span className="text-[28px] font-bold tracking-tight text-white">
          Expensio
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="whitespace-pre-line text-[32px] font-bold leading-[1.15] tracking-tighter text-white">
          {"Take control of\nevery dollar."}
        </h1>
        <p className="text-sm leading-relaxed text-white/80">
          Track expenses, set budgets, and gain financial clarity — all in one
          place.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.13]" />
        <div className="flex gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-lg font-bold text-white">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium text-white/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

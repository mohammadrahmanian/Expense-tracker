import { type FC } from "react";

const shapes = [
  {
    className:
      "w-64 h-64 rounded-full bg-emerald-100/60 top-[8%] left-[5%] blur-sm",
    animation: "float-drift 8s ease-in-out infinite",
  },
  {
    className:
      "w-40 h-40 rounded-2xl bg-teal-100/50 top-[15%] right-[10%] rotate-12 blur-[2px]",
    animation: "float-drift-alt 10s ease-in-out infinite 1s",
  },
  {
    className:
      "w-24 h-24 rounded-full bg-cyan-100/40 top-[50%] left-[8%] blur-[1px]",
    animation: "float-drift 12s ease-in-out infinite 2s",
  },
  {
    className:
      "w-52 h-52 rounded-3xl bg-emerald-50/70 top-[60%] right-[3%] -rotate-6 blur-sm",
    animation: "float-drift-alt 9s ease-in-out infinite 0.5s",
  },
  {
    className:
      "w-16 h-16 rounded-lg bg-teal-200/30 top-[35%] left-[45%] rotate-45",
    animation: "float-drift 7s ease-in-out infinite 3s",
  },
  {
    className:
      "w-32 h-32 rounded-full bg-emerald-100/40 bottom-[10%] left-[25%] blur-[2px]",
    animation: "float-drift-alt 11s ease-in-out infinite 1.5s",
  },
];

export const FloatingShapes: FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {shapes.map((shape, i) => (
      <div
        key={i}
        className={`absolute ${shape.className}`}
        style={{ animation: shape.animation }}
      />
    ))}
  </div>
);

const MINUS = "\u2212";

/**
 * Month-over-month percent change: ((current − previous) / previous) × 100.
 * Returns undefined when comparison is not valid (missing values, non-finite, or previous === 0).
 */
export function formatMonthOverMonthPercentChange(
  current: number | undefined,
  previous: number | undefined,
): string | undefined {
  if (current === undefined || previous === undefined) return undefined;
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return undefined;
  if (previous === 0) return undefined;

  const deltaPct = ((current - previous) / previous) * 100;
  if (!Number.isFinite(deltaPct)) return undefined;

  const rounded = Math.round(deltaPct * 10) / 10;
  const absPart = (() => {
    const abs = Math.abs(rounded);
    return Number.isInteger(abs) ? String(abs) : abs.toFixed(1);
  })();

  if (rounded === 0) return "+0%";
  if (rounded > 0) return `+${absPart}%`;
  return `${MINUS}${absPart}%`;
}

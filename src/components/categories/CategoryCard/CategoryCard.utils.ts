export function budgetProgressPercent(
  monthlySpent: number,
  budgetAmount: number | null | undefined,
): number {
  if (budgetAmount == null || budgetAmount <= 0) return 0;
  return Math.min(100, (monthlySpent / budgetAmount) * 100);
}

export function budgetProgressPercent(
  monthlySpent: number,
  monthlyBudget: number | null | undefined,
): number {
  if (monthlyBudget == null || monthlyBudget <= 0) return 0;
  return Math.min(100, (monthlySpent / monthlyBudget) * 100);
}

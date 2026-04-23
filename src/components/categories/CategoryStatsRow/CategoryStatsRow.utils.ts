export const getAmountStatTitle = (type: "EXPENSE" | "INCOME") =>
  type === "EXPENSE" ? "Total Spent" : "Total Earned";

export const getAmountStatValueClassName = (type: "EXPENSE" | "INCOME") =>
  type === "EXPENSE" ? "text-danger-500" : "text-success-500";

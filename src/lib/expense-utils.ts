import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  isSameDay,
  subDays,
} from "date-fns";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

export interface BudgetInfo {
  monthlyLimit: number;
  expenses: Expense[];
}

export const calculateDailyLimit = (monthlyLimit: number): number => {
  const today = new Date();
  const endOfCurrentMonth = endOfMonth(today);
  const remainingDays = differenceInDays(endOfCurrentMonth, today) + 1;
  return monthlyLimit / remainingDays;
};

export const calculateDailySpending = (
  expenses: Expense[],
  date: Date,
): number => {
  return expenses
    .filter((expense) => isSameDay(new Date(expense.date), date))
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const calculateMonthlySpending = (expenses: Expense[]): number => {
  const today = new Date();
  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);

  return expenses
    .filter(
      (expense) =>
        new Date(expense.date) >= startMonth &&
        new Date(expense.date) <= endMonth,
    )
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const calculateSpendingTrend = (expenses: Expense[]): number => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i));

  const dailySpending = last7Days.map((date) =>
    calculateDailySpending(expenses, date),
  );

  // Calculate trend (positive means increasing spending, negative means decreasing)
  let trend = 0;
  for (let i = 1; i < dailySpending.length; i++) {
    trend += dailySpending[i - 1] - dailySpending[i];
  }

  return trend / 6; // Average daily change
};

export const getBudgetStatus = (
  monthlySpending: number,
  monthlyLimit: number,
  spendingTrend: number,
): {
  status: "excellent" | "good" | "bad" | "worst";
  color: string;
} => {
  const ratio = monthlySpending / monthlyLimit;
  const daysInMonth =
    differenceInDays(endOfMonth(new Date()), startOfMonth(new Date())) + 1;
  const dayOfMonth = differenceInDays(new Date(), startOfMonth(new Date())) + 1;
  const expectedRatio = dayOfMonth / daysInMonth;

  // If spending less than expected and trend is stable/decreasing
  if (ratio <= expectedRatio * 0.9 && spendingTrend <= 0) {
    return { status: "excellent", color: "#46988B" };
  }

  // If spending close to expected and trend is stable
  if (
    ratio <= expectedRatio * 1.1 &&
    Math.abs(spendingTrend) < monthlyLimit * 0.01
  ) {
    return { status: "good", color: "#46988B" };
  }

  // If spending more than expected but trend is decreasing
  if (ratio <= expectedRatio * 1.2 || spendingTrend < 0) {
    return { status: "bad", color: "#EED668" };
  }

  // If spending much more than expected and trend is increasing
  return { status: "worst", color: "#E0533D" };
};

export const calculateBudgetScore = (
  monthlySpending: number,
  monthlyLimit: number,
  spendingTrend: number,
): number => {
  const ratio = monthlySpending / monthlyLimit;
  const daysInMonth =
    differenceInDays(endOfMonth(new Date()), startOfMonth(new Date())) + 1;
  const dayOfMonth = differenceInDays(new Date(), startOfMonth(new Date())) + 1;
  const expectedRatio = dayOfMonth / daysInMonth;

  // Base score based on spending ratio compared to expected
  let score = 100 - Math.max(0, ratio - expectedRatio) * 100;

  // Adjust score based on trend
  if (spendingTrend > 0) {
    score -= Math.min(20, (spendingTrend / monthlyLimit) * 1000); // Penalty for increasing trend
  } else {
    score += Math.min(10, Math.abs(spendingTrend / monthlyLimit) * 500); // Bonus for decreasing trend
  }

  // Final score ranges
  if (score >= 90) return 100; // Excellent
  if (score >= 70) return 90; // Good
  if (score >= 50) return 70; // Bad
  return Math.max(0, Math.min(50, score)); // Worst
};

export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ["Date", "Amount", "Category", "Description"];
  const rows = expenses.map((expense) => [
    new Date(expense.date).toLocaleDateString(),
    expense.amount.toFixed(2),
    expense.category,
    expense.description || "",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};

export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const validatePassword = (input: string): boolean => {
  return input === "040404";
};

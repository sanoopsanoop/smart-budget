import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfMonth, eachDayOfInterval, format, isSameDay } from "date-fns";
import { Expense } from "@/lib/expense-utils";

type ExpenseComparisonChartProps = {
  data?: Expense[];
  monthlyLimit: number;
};

const ExpenseComparisonChart = ({
  data = [],
  monthlyLimit,
}: ExpenseComparisonChartProps) => {
  const chartData = React.useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);

    // Get all days from start of month to today
    const days = eachDayOfInterval({
      start: monthStart,
      end: today,
    });

    // Calculate daily budget (expected spending)
    const daysInMonth = days.length;
    const dailyBudget = monthlyLimit / daysInMonth;

    // Calculate cumulative expected and actual spending
    let cumulativeExpected = 0;
    let cumulativeActual = 0;

    return days.map((date) => {
      // Add daily budget to expected
      cumulativeExpected += dailyBudget;

      // Add actual expenses for this day
      const dayExpenses = data
        .filter((expense) => isSameDay(new Date(expense.date), date))
        .reduce((sum, expense) => sum + expense.amount, 0);
      cumulativeActual += dayExpenses;

      return {
        date: format(date, "MMM dd"),
        expected: Math.round(cumulativeExpected),
        actual: Math.round(cumulativeActual),
      };
    });
  }, [data, monthlyLimit]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Expected vs Actual Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#666" }} />
              <YAxis
                tick={{ fill: "#666" }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Amount"]}
                labelFormatter={(date) => date}
              />
              <Legend />
              <Line
                type="monotone"
                name="Expected"
                dataKey="expected"
                stroke="#46988B"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                name="Actual"
                dataKey="actual"
                stroke="#E0533D"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseComparisonChart;

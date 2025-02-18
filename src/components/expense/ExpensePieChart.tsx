import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_CATEGORIES } from "@/stores/expenseStore";

type ExpenseData = {
  amount: number;
  category: string;
  date: Date;
};

type ExpensePieChartProps = {
  data?: ExpenseData[];
};

const COLORS = {
  food: "#377CC8",
  housing: "#46988B",
  traveling: "#E0533D",
  entertainment: "#EED668",
};

const ExpensePieChart = ({ data = [] }: ExpensePieChartProps) => {
  const chartData = React.useMemo(() => {
    const categoryMap = new Map<string, number>();

    // Initialize all categories with 0
    EXPENSE_CATEGORIES.forEach((cat) => {
      categoryMap.set(cat.id, 0);
    });

    // Sum up expenses for each category
    data.forEach((expense) => {
      if (categoryMap.has(expense.category)) {
        const current = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, current + expense.amount);
      }
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category:
        EXPENSE_CATEGORIES.find((cat) => cat.id === category)?.label ||
        category,
      amount,
      id: category,
    }));
  }, [data]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) =>
                  `${category}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={COLORS[entry.id as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`₹${value.toFixed(2)}`, "Amount"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;

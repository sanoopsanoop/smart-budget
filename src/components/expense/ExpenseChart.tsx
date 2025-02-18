import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subDays, format } from "date-fns";

type ExpenseData = {
  amount: number;
  date: Date;
};

type ExpenseChartProps = {
  data?: ExpenseData[];
};

const ExpenseChart = ({ data = [] }: ExpenseChartProps) => {
  const chartData = React.useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, "yyyy-MM-dd");
    });

    const expenseMap = new Map(
      data.map((item) => [format(item.date, "yyyy-MM-dd"), item.amount]),
    );

    return dates.map((date) => ({
      date,
      amount: expenseMap.get(date) || 0,
    }));
  }, [data]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Last 7 Days Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                tick={{ fill: "#666" }}
              />
              <YAxis
                tick={{ fill: "#666" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Expense"]}
                labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;

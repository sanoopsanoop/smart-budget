import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type ExpenseData = {
  amount: number;
  date: Date;
};

type ExpenseChartProps = {
  data?: ExpenseData[];
};

const ExpenseLineChart = ({ data = [] }: ExpenseChartProps) => {
  const chartData = React.useMemo(() => {
    const sortedData = [...data].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    return sortedData.map((item) => ({
      date: format(item.date, "MMM dd"),
      amount: item.amount,
    }));
  }, [data]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Expense Trend
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
                formatter={(value) => [`₹${value}`, "Expense"]}
                labelFormatter={(date) => date}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#377CC8"
                strokeWidth={2}
                dot={{ fill: "#377CC8", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseLineChart;

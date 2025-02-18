import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DailySpendingIndicatorProps {
  date: Date;
  spending: number;
  limit: number;
}

const DailySpendingIndicator = ({
  date,
  spending,
  limit,
}: DailySpendingIndicatorProps) => {
  const isOverLimit = spending > limit;
  const percentage = Math.min((spending / limit) * 100, 100);

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span
              className={cn(isOverLimit ? "text-red-500" : "text-green-500")}
            >
              ₹{spending.toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                isOverLimit ? "bg-red-500" : "bg-green-500",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-right">
            Limit: ₹{limit.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySpendingIndicator;

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import NumericKeypad from "./NumericKeypad";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EXPENSE_CATEGORIES } from "@/stores/expenseStore";
import { Input } from "@/components/ui/input";
import { RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResetConfirmationDialog from "./ResetConfirmationDialog";
import {
  getBudgetStatus,
  calculateDailyLimit,
  calculateAverageDailySpending,
  calculateProjectedMonthlyExpense,
} from "@/lib/expense-utils";
import { differenceInDays, endOfMonth } from "date-fns";

interface AddExpenseFormProps {
  onSubmit: (data: {
    amount: number;
    category: string;
    date: Date;
    description?: string;
  }) => void;
  budgetScore?: number;
  remainingBudget?: number;
  monthlyLimit?: number;
  expenses?: Array<{
    amount: number;
    date: Date;
  }>;
}

const AddExpenseForm = ({
  onSubmit,
  budgetScore = 0,
  remainingBudget = 0,
  monthlyLimit = 1000,
  expenses = [],
}: AddExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    EXPENSE_CATEGORIES[0].id,
  );
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Calculate progress percentage and status
  const monthlyProgressPercentage = Math.min(
    ((monthlyLimit - remainingBudget) / monthlyLimit) * 100,
    100,
  );

  const budgetStatus = getBudgetStatus(
    monthlyLimit - remainingBudget,
    monthlyLimit,
    0, // Default trend
  );

  const handleNumberClick = (num: string) => {
    if (amount.includes(".") && num === ".") return;
    setAmount((prev) => prev + num);
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onSubmit({
      amount: numAmount,
      category: selectedCategory,
      date,
      description: description.trim(),
    });
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setSelectedCategory(EXPENSE_CATEGORIES[0].id);
    setDate(new Date());
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[40px] overflow-hidden">
      <div className="bg-white p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Smart Budget</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowResetDialog(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="text-2xl font-bold">{budgetScore}</span>
          </div>
          <div
            className={cn(
              "text-lg font-semibold capitalize px-4 py-1 rounded-full",
              budgetStatus.status === "excellent"
                ? "bg-green-100 text-green-700"
                : budgetStatus.status === "good"
                  ? "bg-blue-100 text-blue-700"
                  : budgetStatus.status === "bad"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700",
            )}
          >
            {budgetStatus.status}
          </div>
        </div>

        {/* Budget Information */}
        <div className="bg-white rounded-2xl p-6 space-y-6 shadow-lg">
          {/* Monthly Progress Bar */}
          <div className="space-y-2">
            <div className="text-gray-600 font-medium">Monthly Budget</div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  monthlyProgressPercentage > 90
                    ? "bg-red-500"
                    : monthlyProgressPercentage > 70
                      ? "bg-yellow-500"
                      : "bg-green-500",
                )}
                style={{ width: `${monthlyProgressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <div>₹{(monthlyLimit - remainingBudget).toFixed(0)} spent</div>
              <div>₹{monthlyLimit.toFixed(0)} limit</div>
            </div>
          </div>

          {/* Budget Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <div className="text-sm font-medium text-gray-500">
                Projected Monthly
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{calculateProjectedMonthlyExpense(expenses).toFixed(0)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {calculateProjectedMonthlyExpense(expenses) > monthlyLimit
                    ? "(Over budget)"
                    : "(Within budget)"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Remaining</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{remainingBudget.toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Days Left</div>
              <div className="text-2xl font-bold text-blue-600">
                {differenceInDays(endOfMonth(new Date()), new Date()) + 1}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">
                Daily Target
              </div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{calculateDailyLimit(remainingBudget).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Avg Spent</div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{calculateAverageDailySpending(expenses).toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {EXPENSE_CATEGORIES.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={cn(
                "py-2 px-6 rounded-full text-sm font-medium flex items-center gap-2",
                selectedCategory === id ? "bg-blue-100" : "bg-gray-100",
              )}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="text-center space-y-2">
          <div className="text-gray-500 text-sm">Expenses</div>
          <div className="text-4xl font-medium tracking-tight">
            ₹{amount || "0.00"}
          </div>
          <Input
            type="text"
            placeholder="Add description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 text-center bg-gray-50 border-gray-200"
          />
        </div>

        <NumericKeypad
          onNumberClick={handleNumberClick}
          onDelete={handleDelete}
          onDateClick={() => setShowCalendar(true)}
          onSubmit={handleSubmit}
        />
      </div>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="bg-white p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                setShowCalendar(false);
              }
            }}
            className="rounded-md"
          />
        </DialogContent>
      </Dialog>

      <ResetConfirmationDialog
        open={showResetDialog}
        onConfirm={() => {
          resetForm();
          setShowResetDialog(false);
        }}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  );
};

export default AddExpenseForm;

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import NumericKeypad from "./NumericKeypad";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useExpenseStore, EXPENSE_CATEGORIES } from "@/stores/expenseStore";
import {
  calculateMonthlySpending,
  calculateDailyLimit,
  getBudgetStatus,
  calculateDailySpending,
  calculateBudgetScore,
  calculateSpendingTrend,
} from "@/lib/expense-utils";
import { endOfMonth, differenceInDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResetConfirmationDialog from "./ResetConfirmationDialog";

interface AddExpenseFormProps {
  onSubmit: (data: {
    amount: number;
    category: string;
    date: Date;
    description?: string;
  }) => void;
}

const AddExpenseForm = ({ onSubmit }: AddExpenseFormProps) => {
  const { expenses, monthlyLimit } = useExpenseStore();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    EXPENSE_CATEGORIES[0].id,
  );
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Calculate budget metrics
  const monthlySpending = calculateMonthlySpending(expenses);
  const remainingBudget = monthlyLimit - monthlySpending;
  const dailyLimit = calculateDailyLimit(remainingBudget);
  const dailySpending = calculateDailySpending(expenses, new Date());
  const spendingTrend = calculateSpendingTrend(expenses);

  // Calculate days left in month
  const today = new Date();
  const endOfCurrentMonth = endOfMonth(today);
  const daysLeft = differenceInDays(endOfCurrentMonth, today) + 1;

  // Calculate progress percentage and status
  const progressPercentage = Math.min((dailySpending / dailyLimit) * 100, 100);
  const monthlyProgressPercentage = Math.min(
    (monthlySpending / monthlyLimit) * 100,
    100,
  );
  const budgetStatus = getBudgetStatus(
    monthlySpending,
    monthlyLimit,
    spendingTrend,
  );

  // Calculate score based on monthly spending and trend
  const score = calculateBudgetScore(
    monthlySpending,
    monthlyLimit,
    spendingTrend,
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
      <div
        className={cn("p-8 space-y-4 transition-colors duration-300")}
        style={{ backgroundColor: budgetStatus.color }}
      >
        <div className="flex justify-between items-center text-white">
          <h1 className="text-4xl font-bold">Smart Budget</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowResetDialog(true)}
            className="text-white hover:text-gray-200"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <div className="text-lg font-semibold capitalize">
            {budgetStatus.status}
          </div>
        </div>

        {/* Monthly Progress Bar */}
        <div className="space-y-1">
          <div className="text-white/90 text-sm">Monthly Budget</div>
          <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${monthlyProgressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-white/90 text-sm">
            <div>₹{monthlySpending.toFixed(0)}</div>
            <div>₹{monthlyLimit.toFixed(0)}</div>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="space-y-1">
          <div className="text-white/90 text-sm">Daily Budget</div>
          <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-white/90 text-sm">
            <div>₹{dailySpending.toFixed(0)}</div>
            <div>₹{dailyLimit.toFixed(0)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white">
          <span className="text-sm">Days Left:</span>
          <span className="text-lg font-semibold">{daysLeft}</span>
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

import React, { useState, useEffect } from "react";
import AddExpenseForm from "./expense/AddExpenseForm";
import ExpenseChart from "./expense/ExpenseChart";
import BudgetSetup from "./expense/BudgetSetup";
import DailySpendingIndicator from "./expense/DailySpendingIndicator";
import { Button } from "@/components/ui/button";
import { Download, Settings } from "lucide-react";
import {
  Expense,
  BudgetInfo,
  calculateDailyLimit,
  calculateDailySpending,
  calculateMonthlySpending,
  calculateBudgetScore,
  exportToCSV,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "@/lib/expense-utils";
import { subDays } from "date-fns";

const Home = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState(1000);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);

  useEffect(() => {
    const savedData = loadFromLocalStorage("budgetInfo");
    if (savedData) {
      setExpenses(
        savedData.expenses.map((e: any) => ({ ...e, date: new Date(e.date) })),
      );
      setMonthlyLimit(savedData.monthlyLimit);
    }
  }, []);

  useEffect(() => {
    const budgetInfo: BudgetInfo = { monthlyLimit, expenses };
    saveToLocalStorage("budgetInfo", budgetInfo);
  }, [monthlyLimit, expenses]);

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleExport = async () => {
    try {
      const { data, filename } = await exportExpenses(expenses, {
        format: "csv",
        includeDescription: true,
      });

      // For browser downloads
      if (typeof window !== "undefined" && window.navigator) {
        const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
        saveAs(blob, filename);
      }

      toast({
        title: "Export Successful",
        description: `Expenses exported to ${filename}`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your expenses.",
      });
    }
    const csv = generateCSV(expenses);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const monthlySpending = calculateMonthlySpending(expenses);
  const remainingBudget = monthlyLimit - monthlySpending;
  const dailyLimit = calculateDailyLimit(remainingBudget);
  const budgetScore = calculateBudgetScore(monthlyLimit, expenses);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date,
      spending: calculateDailySpending(expenses, date),
      limit: dailyLimit,
    };
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expense Tracker
            </h1>
            <p className="mt-2 text-gray-600">
              Keep track of your daily expenses and manage your budget
              effectively
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowBudgetSetup(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Budget
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AddExpenseForm
              onSubmit={handleAddExpense}
              budgetScore={budgetScore}
              remainingBudget={remainingBudget}
              monthlyLimit={monthlyLimit}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ExpenseChart data={expenses} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {last7Days.map(({ date, spending, limit }) => (
                <DailySpendingIndicator
                  key={date.toISOString()}
                  date={date}
                  spending={spending}
                  limit={limit}
                />
              ))}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Expenses
              </h2>
              <div className="space-y-4">
                {expenses.length === 0 ? (
                  <p className="text-gray-600">No expenses added yet</p>
                ) : (
                  expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between border-b border-gray-200 pb-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          ${expense.amount.toFixed(2)} - {expense.category}
                        </p>
                        {expense.description && (
                          <p className="text-sm text-gray-600">
                            {expense.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-500">
                          {expense.date.toLocaleDateString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BudgetSetup
        open={showBudgetSetup}
        onClose={() => setShowBudgetSetup(false)}
        onSave={setMonthlyLimit}
        currentLimit={monthlyLimit}
      />
    </div>
  );
};

export default Home;

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Settings, Trash2, RotateCcw } from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "@/components/ui/use-toast";
import BudgetSetup from "@/components/expense/BudgetSetup";
import ExpenseLineChart from "@/components/expense/ExpenseLineChart";
import ExpensePieChart from "@/components/expense/ExpensePieChart";
import ExpenseComparisonChart from "@/components/expense/ExpenseComparisonChart";
import ResetConfirmationDialog from "@/components/expense/ResetConfirmationDialog";

import {
  calculateMonthlySpending,
  calculateBudgetScore,
  calculateSpendingTrend,
  generateCSV,
} from "@/lib/expense-utils";
import { useExpenseStore } from "@/stores/expenseStore";

const Dashboard = () => {
  const {
    expenses,
    monthlyLimit,
    setMonthlyLimit,
    deleteExpense,
    resetExpenses,
  } = useExpenseStore();
  const [showBudgetSetup, setShowBudgetSetup] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);

  const handleExport = async () => {
    try {
      const csv = generateCSV(expenses);
      const filename = `expenses_${new Date().toISOString().split("T")[0]}.csv`;

      // For browser downloads
      if (typeof window !== "undefined" && window.navigator) {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
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
  };

  const monthlySpending = calculateMonthlySpending(expenses);
  const remainingBudget = monthlyLimit - monthlySpending;
  const spendingTrend = calculateSpendingTrend(expenses);
  const budgetScore = calculateBudgetScore(
    monthlySpending,
    monthlyLimit,
    spendingTrend,
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Track your spending</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBudgetSetup(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Limit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowResetDialog(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <ExpenseComparisonChart data={expenses} monthlyLimit={monthlyLimit} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpenseLineChart data={expenses} />
          <ExpensePieChart data={expenses} />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="text-gray-500">No expenses yet</p>
            ) : (
              [...expenses]
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-start border-b border-gray-100 pb-3"
                  >
                    <div>
                      <p className="font-medium">
                        ₹{expense.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {expense.category}
                      </p>
                      {expense.description && (
                        <p className="text-xs text-gray-500">
                          {expense.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-gray-500">
                        {expense.date.toLocaleDateString()}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <BudgetSetup
        open={showBudgetSetup}
        onClose={() => setShowBudgetSetup(false)}
        onSave={setMonthlyLimit}
        currentLimit={monthlyLimit}
      />

      <ResetConfirmationDialog
        open={showResetDialog}
        onConfirm={() => {
          resetExpenses();
          setShowResetDialog(false);
        }}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  );
};

export default Dashboard;

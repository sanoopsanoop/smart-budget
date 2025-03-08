import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddExpenseForm from "@/components/expense/AddExpenseForm";
import ExcelImport from "@/components/expense/ExcelImport";
import SmsImport from "@/components/expense/SmsImport";
import { useExpenseStore } from "@/stores/expenseStore";
import {
  calculateMonthlySpending,
  calculateBudgetScore,
  calculateSpendingTrend,
  Expense,
} from "@/lib/expense-utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

const AddExpense = () => {
  const navigate = useNavigate();
  const { expenses, monthlyLimit, addExpense } = useExpenseStore();
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showSmsImport, setShowSmsImport] = useState(false);

  const monthlySpending = calculateMonthlySpending(expenses);
  const remainingBudget = monthlyLimit - monthlySpending;
  const spendingTrend = calculateSpendingTrend(expenses);
  const budgetScore = calculateBudgetScore(
    monthlySpending,
    monthlyLimit,
    spendingTrend,
  );

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    addExpense(expense);
    navigate("/");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        <Button
          variant="outline"
          onClick={() => setShowExcelImport(true)}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Import Excel
        </Button>
      </div>
      <AddExpenseForm
        onSubmit={handleAddExpense}
        budgetScore={budgetScore}
        remainingBudget={remainingBudget}
        monthlyLimit={monthlyLimit}
        expenses={expenses}
      />
      <ExcelImport
        open={showExcelImport}
        onClose={() => setShowExcelImport(false)}
        onImport={(expenses) => {
          expenses.forEach((expense) => handleAddExpense(expense));
        }}
      />
      <SmsImport
        open={showSmsImport}
        onClose={() => setShowSmsImport(false)}
        onImport={handleAddExpense}
      />
    </div>
  );
};

export default AddExpense;

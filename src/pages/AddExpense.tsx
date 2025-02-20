import React from "react";
import { useNavigate } from "react-router-dom";
import AddExpenseForm from "@/components/expense/AddExpenseForm";
import { useExpenseStore } from "@/stores/expenseStore";
import {
  calculateMonthlySpending,
  calculateBudgetScore,
  calculateSpendingTrend,
  Expense,
} from "@/lib/expense-utils";

const AddExpense = () => {
  const navigate = useNavigate();
  const { expenses, monthlyLimit, addExpense } = useExpenseStore();

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Expense</h1>
      <AddExpenseForm
        onSubmit={handleAddExpense}
        budgetScore={budgetScore}
        remainingBudget={remainingBudget}
        monthlyLimit={monthlyLimit}
        expenses={expenses}
      />
    </div>
  );
};

export default AddExpense;

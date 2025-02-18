import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Expense } from "@/lib/expense-utils";

export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food", icon: "🍕" },
  { id: "housing", label: "Housing", icon: "🏠" },
  { id: "traveling", label: "Traveling", icon: "✈️" },
  { id: "entertainment", label: "Entertainment", icon: "🎮" },
  { id: "others", label: "Others", icon: "📦" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["id"];

interface ExpenseState {
  expenses: Expense[];
  monthlyLimit: number;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  setMonthlyLimit: (limit: number) => void;
  resetExpenses: () => void;
}

export const useExpenseStore = create<ExpenseState>(
  persist(
    (set) => ({
      expenses: [],
      monthlyLimit: 1000,
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: crypto.randomUUID() },
          ],
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      setMonthlyLimit: (limit) => set({ monthlyLimit: limit }),
      resetExpenses: () => set({ expenses: [] }),
    }),
    {
      name: "expense-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        expenses: state.expenses.map((expense) => ({
          ...expense,
          date: expense.date.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.expenses = state.expenses.map((expense) => ({
            ...expense,
            date: new Date(expense.date),
          }));
        }
      },
    },
  ),
);

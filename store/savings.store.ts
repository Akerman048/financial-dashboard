import { mockSavingsGoals } from "@/data/mockSavingsGoals";
import { SavingsGoal } from "@/types/savings.types";
import { create } from "zustand";

type SavingsState = {
  savings: SavingsGoal[];
  addGoal: (goal: SavingsGoal) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (updatedGoal: SavingsGoal) => void;
  updateCurrentAmount: (id: string, amount: number) => void;
};

export const useSavingStore = create<SavingsState>((set) => ({
  savings: mockSavingsGoals,
  addGoal: (item) => set((state) => ({ savings: [item, ...state.savings] })),
  deleteGoal: (id) =>
    set((state) => ({
      savings: state.savings.filter((item) => item.id !== id),
    })),
  updateGoal: (updatedGoal) =>
    set((state) => ({
      savings: state.savings.map((item) =>
        item.id === updatedGoal.id ? updatedGoal : item,
      ),
    })),
  updateCurrentAmount: (id, amount) =>
    set((state) => ({
      savings: state.savings.map((item) =>
        item.id === id
          ? {
              ...item,
              currentAmount: Math.max(
                0,
                Math.min(item.currentAmount + amount, item.targetAmount),
              ),
            }
          : item,
      ),
    })),
}));

import { create } from "zustand";
import { Transaction } from "@/types/transaction.types";

type FinanceState = {
  transactions: Transaction[];
  setTransactions: (items: Transaction[]) => void;
  addTransaction: (item: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (updatedItem: Transaction) => void;
};

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],

  setTransactions: (items) => set({ transactions: items }),

  addTransaction: (item) =>
    set((state) => ({
      transactions: [item, ...state.transactions],
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((item) => item.id !== id),
    })),

  updateTransaction: (updatedItem) =>
    set((state) => ({
      transactions: state.transactions.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    })),
}));

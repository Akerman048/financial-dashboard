import { Transaction } from "@/types/transaction.types";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    title: "Salary",
    category: "Job",
    amount: 3200,
    date: "2026-03-01",
  },
  {
    id: "2",
    type: "expense",
    title: "Groceries",
    category: "Food",
    amount: 120,
    date: "2026-03-03",
  },
  {
    id: "3",
    type: "expense",
    title: "Bus card",
    category: "Transport",
    amount: 45,
    date: "2026-03-05",
  },
  {
    id: "4",
    type: "income",
    title: "Freelance",
    category: "Work",
    amount: 500,
    date: "2026-03-10",
  },
];
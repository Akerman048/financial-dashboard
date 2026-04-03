export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  amount: number;
  date: string;
};

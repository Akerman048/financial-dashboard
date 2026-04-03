"use client";

import { useFinanceStore } from "@/store/finance.store";
import { Transaction } from "@/types/transaction.types";

type TransactionsListProps = {
  onEdit: (transaction: Transaction) => void;
};

export default function TransactionsList({ onEdit }: TransactionsListProps) {
  const transactions = useFinanceStore((state) => state.transactions);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  return (
    <div className="rounded-xl border p-4 flex flex-col lg:h-full lg:min-h-0">
      <h2 className="mb-4 text-xl font-bold">Transactions</h2>

      <div className="space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-xl border p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{transaction.title}</p>
              <p className="text-sm opacity-70">
                {transaction.category} • {transaction.date}
              </p>
              <p className="text-sm">{transaction.type}</p>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-bold">{transaction.amount}</p>

              <button
                onClick={() => onEdit(transaction)}
                className="rounded-lg border px-3 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="rounded-lg border px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
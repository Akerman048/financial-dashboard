"use client";

import { useEffect, useState } from "react";
import { useFinanceStore } from "@/store/finance.store";
import { Transaction, TransactionType } from "@/types/transaction.types";

type Props = {
  transactionToEdit?: Transaction | null;
  clearEditing?: () => void;
};

export default function AddTransactionForm({
  transactionToEdit = null,
  clearEditing,
}: Props) {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setCategory(transactionToEdit.category);
      setAmount(String(transactionToEdit.amount));
      setDate(transactionToEdit.date);
      setType(transactionToEdit.type);
    }
  }, [transactionToEdit]);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setAmount("");
    setDate("");
    setType("expense");
    clearEditing?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim() || !amount || !date) return;

    const preparedData = {
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      date,
      type,
    };

    if (transactionToEdit) {
      updateTransaction({
        id: transactionToEdit.id,
        ...preparedData,
      });
    } else {
      addTransaction({
        id: crypto.randomUUID(),
        ...preparedData,
      });
    }

    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-4 flex flex-col gap-4 lg:h-full"
    >
      <h2 className="text-lg font-semibold">
        {transactionToEdit ? "Edit transaction" : "Add transaction"}
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        type="number"
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        className="w-full rounded-lg border px-3 py-2"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
        className="w-full rounded-lg border px-3 py-2"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg border px-4 py-2 cursor-pointer self-start"
        >
          {transactionToEdit ? "Save changes" : "Add"}
        </button>

        {transactionToEdit && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

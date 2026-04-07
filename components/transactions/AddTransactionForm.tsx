"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { useFinanceStore } from "@/store/finance.store";
import { Transaction, TransactionType } from "@/types/transaction.types";
import {
  createUserTransaction,
  updateUserTransaction,
} from "@/lib/firebase/transactions";

type Props = {
  user: User | null;
  transactionToEdit?: Transaction | null;
  clearEditing?: () => void;
};

const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Bills",
  "Travel",
  "Gift",
  "Other",
] as const;

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Bonus",
  "Investment",
  "Gift",
  "Refund",
  "Other",
] as const;

export default function AddTransactionForm({
  user,
  transactionToEdit = null,
  clearEditing,
}: Props) {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [errorMessage, setErrorMessage] = useState("");

  const categoryOptions = useMemo(() => {
    return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }, [type]);

  useEffect(() => {
    if (!transactionToEdit) return;

    setTitle(transactionToEdit.title);
    setAmount(String(transactionToEdit.amount));
    setDate(transactionToEdit.date);
    setType(transactionToEdit.type);

    const validCategories =
      transactionToEdit.type === "income"
        ? INCOME_CATEGORIES
        : EXPENSE_CATEGORIES;

    if (validCategories.includes(transactionToEdit.category as never)) {
      setSelectedCategory(transactionToEdit.category);
      setCustomCategory("");
    } else {
      setSelectedCategory("Other");
      setCustomCategory(transactionToEdit.category);
    }
  }, [transactionToEdit]);

  useEffect(() => {
    setSelectedCategory("");
    setCustomCategory("");
  }, [type]);

  const resetForm = () => {
    setTitle("");
    setSelectedCategory("");
    setCustomCategory("");
    setAmount("");
    setDate("");
    setType("expense");
    setErrorMessage("");
    clearEditing?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory =
      selectedCategory === "Other"
        ? customCategory.trim()
        : selectedCategory.trim();

    if (!title.trim() || !finalCategory || !amount || !date) return;

    const preparedData = {
      title: title.trim(),
      category: finalCategory,
      amount: Number(amount),
      date,
      type,
    };

    try {
      setErrorMessage("");

      if (transactionToEdit) {
        const updatedTransaction: Transaction = {
          id: transactionToEdit.id,
          ...preparedData,
        };

        if (user) {
          await updateUserTransaction(user.uid, updatedTransaction);
        }

        updateTransaction(updatedTransaction);
      } else {
        const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          ...preparedData,
        };

        if (user) {
          await createUserTransaction(user.uid, newTransaction);
        }

        addTransaction(newTransaction);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setErrorMessage(
        "Failed to save transaction. Check Firebase rules and console."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl p-4 lg:h-full"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
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

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      >
        <option value="" disabled>
          Select category
        </option>

        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {selectedCategory === "Other" && (
        <input
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          placeholder="Custom category"
          className="w-full rounded-lg border px-3 py-2"
        />
      )}

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

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="cursor-pointer self-start rounded-lg border px-4 py-2"
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
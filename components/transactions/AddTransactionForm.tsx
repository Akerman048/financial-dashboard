"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import clsx from "clsx";
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

const fieldClassName =
  "w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-foreground transition outline-none placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring";

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
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery shopping"
            className={fieldClassName}
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className={fieldClassName}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={fieldClassName}
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
        </div>

        {selectedCategory === "Other" && (
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Custom category
            </label>
            <input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter category"
              className={fieldClassName}
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Amount
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              className={fieldClassName}
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Date
            </label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className={fieldClassName}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-2">
        {errorMessage && (
          <p className="rounded-xl border border-[var(--danger-soft)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {transactionToEdit ? "Save changes" : "Add transaction"}
          </button>

          {transactionToEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-border bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
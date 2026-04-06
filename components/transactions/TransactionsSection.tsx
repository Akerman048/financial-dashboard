"use client";

import { useState } from "react";
import clsx from "clsx";
import { Transaction } from "@/types/transaction.types";
import TransactionsList from "./TransactionsList";
import AddTransactionForm from "./AddTransactionForm";

export default function TransactionsSection() {
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const clearEditing = () => setTransactionToEdit(null);

  return (
  <section
  className={clsx(
    "w-full min-w-0 rounded-xl p-3 h-full min-h-0",
    "flex flex-col gap-4",
    "lg:grid lg:grid-cols-12 lg:grid-rows-5 lg:gap-4"
  )}
>
  <div className="min-w-0 lg:col-span-8 lg:row-start-1 lg:row-end-6">
    <TransactionsList  onEdit={setTransactionToEdit}
  showPagination={true}
  showActions={true} />
  </div>

  <div className="min-w-0 lg:col-span-4 lg:row-start-1 lg:row-end-4">
    <AddTransactionForm
      transactionToEdit={transactionToEdit}
      clearEditing={clearEditing}
    />
  </div>
</section>
  );
}

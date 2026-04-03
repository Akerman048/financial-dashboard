"use client";

import AddTransactionForm from "@/components/dashboard/AddTransactionForm";
import TransactionsList from "@/components/dashboard/TransactionsList";
import { Transaction } from "@/types/transaction.types";
import { useState } from "react";

export default function Transactions() {
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0 lg:grid lg:grid-cols-12 lg:grid-rows-5 lg:overflow-hidden">
      <section className="lg:col-span-7 lg:row-span-3 lg:min-h-0">
        <TransactionsList onEdit={setTransactionToEdit} />
      </section>

      <section className="lg:col-span-5 lg:row-span-3">
        <AddTransactionForm
          transactionToEdit={transactionToEdit}
          clearEditing={() => setTransactionToEdit(null)}
        />
      </section>
    </div>
  );
}

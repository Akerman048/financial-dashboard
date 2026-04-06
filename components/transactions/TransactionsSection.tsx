"use client";

import { useState } from "react";
import clsx from "clsx";
import { Transaction } from "@/types/transaction.types";
import TransactionsList from "./TransactionsList";
import AddTransactionForm from "./AddTransactionForm";
import TransactionsFilters from "./TransactionsFilters";
import TransactionsTrendChart from "./TransactionsTrendChart";

type TransactionFilters = {
  search: string;
  category: string;
  type: "all" | "income" | "expense";
};

export default function TransactionsSection() {
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    category: "",
    type: "all",
  });

  const clearEditing = () => setTransactionToEdit(null);

  return (
    <section
      className={clsx(
        "w-full min-w-0 rounded-xl p-3 h-full min-h-0",
        "flex flex-col gap-4",
        "lg:grid lg:grid-cols-12 lg:grid-rows-10 lg:gap-4"
      )}
    >
      
      <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-2">
        <TransactionsFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-2 lg:row-end-11">
        <TransactionsList
          onEdit={setTransactionToEdit}
          showPagination={true}
          showActions={true}
          filters={filters}
        />
      </div>

      <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-6">
        <AddTransactionForm
          transactionToEdit={transactionToEdit}
          clearEditing={clearEditing}
        />
      </div>

      

      <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-6 lg:row-end-11">
    <TransactionsTrendChart />
  </div>
    </section>
  );
}
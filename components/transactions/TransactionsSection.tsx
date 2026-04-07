"use client";

import { useState } from "react";
import clsx from "clsx";
import { Transaction } from "@/types/transaction.types";
import TransactionsList from "./TransactionsList";
import AddTransactionForm from "./AddTransactionForm";
import TransactionsFilters from "./TransactionsFilters";
import TransactionsTrendChart from "./TransactionsTrendChart";
import DashboardCard from "../dashboard/DashboardCard";

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
    <section className={clsx(
  "w-full min-w-0 rounded-xl p-3 h-full min-h-0",
  "flex flex-col gap-4",
  "lg:grid lg:grid-cols-12 lg:grid-rows-10 lg:gap-4"
)}>

  {/* FILTERS */}
  <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-2">
    <DashboardCard contentClassName="h-full">
      <TransactionsFilters filters={filters} onChange={setFilters} />
    </DashboardCard>
  </div>

  {/* LIST */}
  <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-2 lg:row-end-11">
    <DashboardCard
      title="Transactions"
      contentClassName="h-full"
    >
      <TransactionsList
        onEdit={setTransactionToEdit}
        showPagination
        showActions
        filters={filters}
      />
    </DashboardCard>
  </div>

  {/* FORM */}
  <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-7">
    <DashboardCard
      title={transactionToEdit ? "Edit transaction" : "Add transaction"}
    >
      <AddTransactionForm
        transactionToEdit={transactionToEdit}
        clearEditing={clearEditing}
      />
    </DashboardCard>
  </div>

  {/* CHART */}
  <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-7 lg:row-end-11">
    <DashboardCard title="Trend">
      <TransactionsTrendChart />
    </DashboardCard>
  </div>

</section>
  );
}
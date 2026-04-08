"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Transaction } from "@/types/transaction.types";
import { useFinanceStore } from "@/store/finance.store";
import { useAuthStore } from "@/store/auth.store";
import { mockTransactions } from "@/data/mockTransactions";
import { getUserTransactions } from "@/lib/firebase/transactions";

import TransactionsList from "./TransactionsList";
import AddTransactionForm from "./AddTransactionForm";
import TransactionsFilters from "./TransactionsFilters";
import TransactionsTrendChart from "./TransactionsTrendChart";
import DashboardCard from "../dashboard/DashboardCard";

type TransactionFiltersType = {
  search: string;
  category: string;
  type: "all" | "income" | "expense";
};

export default function TransactionsSection() {
  const user = useAuthStore((state) => state.user);
  const setTransactions = useFinanceStore((state) => state.setTransactions);

  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const [filters, setFilters] = useState<TransactionFiltersType>({
    search: "",
    category: "",
    type: "all",
  });

  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const clearEditing = () => setTransactionToEdit(null);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) {
        setTransactions(mockTransactions);
        setIsLoadingTransactions(false);
        return;
      }

      try {
        setIsLoadingTransactions(true);
        const userTransactions = await getUserTransactions(user.uid);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    loadTransactions();
  }, [user, setTransactions]);

  return (
    <section
      className={clsx(
        "flex h-full min-h-0 w-full min-w-0 flex-col gap-4 rounded-xl",
        "lg:grid lg:grid-cols-12 lg:grid-rows-10"
      )}
    >
      <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-2 lg:min-h-0">
        <DashboardCard contentClassName="h-full">
          <TransactionsFilters filters={filters} onChange={setFilters} />
        </DashboardCard>
      </div>

      <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-2 lg:row-end-11 lg:min-h-0">
        <DashboardCard
          title="Transactions"
          contentClassName="min-h-0 overflow-hidden"
        >
          <TransactionsList
            user={user}
            onEdit={setTransactionToEdit}
            showPagination
            showActions
            filters={filters}
          />
        </DashboardCard>
      </div>

      <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-7 lg:min-h-0">
        <DashboardCard
          title={transactionToEdit ? "Edit transaction" : "Add transaction"}
          contentClassName="min-h-0"
        >
          <AddTransactionForm
            user={user}
            transactionToEdit={transactionToEdit}
            clearEditing={clearEditing}
          />
        </DashboardCard>
      </div>

      <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-7 lg:row-end-11 lg:min-h-0">
        <DashboardCard title="Trend" contentClassName="min-h-0">
          <TransactionsTrendChart />
        </DashboardCard>
      </div>

      {isLoadingTransactions && (
        <div className="lg:col-span-12 text-sm text-muted-foreground">
          Loading transactions...
        </div>
      )}
    </section>
  );
}
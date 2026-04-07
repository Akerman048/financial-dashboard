"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import clsx from "clsx";
import { Transaction } from "@/types/transaction.types";
import { useFinanceStore } from "@/store/finance.store";
import { useAuthStore } from "@/store/auth.store";
import { mockTransactions } from "@/data/mockTransactions";
import { getUserTransactions } from "@/lib/firebase/transactions";
import { listenToAuth } from "@/lib/auth-listener";

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
  const setTransactions = useFinanceStore((state) => state.setTransactions);
  const setUser = useAuthStore((state) => state.setUser);

  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const [filters, setFilters] = useState<TransactionFiltersType>({
    search: "",
    category: "",
    type: "all",
  });

  const [user, setLocalUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const clearEditing = () => setTransactionToEdit(null);

  useEffect(() => {
    const unsubscribe = listenToAuth((firebaseUser) => {
      setLocalUser(firebaseUser);
      setUser(firebaseUser);
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!authResolved) return;

    const loadTransactions = async () => {
      if (!user) {
        setTransactions(mockTransactions);
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
  }, [authResolved, user, setTransactions]);

  if (!authResolved) {
    return <div className="text-sm opacity-70">Checking account...</div>;
  }

  return (
    <section
      className={clsx(
        "w-full min-w-0 rounded-xl p-3 h-full min-h-0",
        "flex flex-col gap-4",
        "lg:grid lg:grid-cols-12 lg:grid-rows-10 lg:gap-4"
      )}
    >
      <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-2">
        <DashboardCard contentClassName="h-full">
          <TransactionsFilters filters={filters} onChange={setFilters} />
        </DashboardCard>
      </div>

      <div className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-2 lg:row-end-11">
        <DashboardCard title="Transactions" contentClassName="h-full">
          <TransactionsList
            user={user}
            onEdit={setTransactionToEdit}
            showPagination
            showActions
            filters={filters}
          />
        </DashboardCard>
      </div>

      <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-7">
        <DashboardCard
          title={transactionToEdit ? "Edit transaction" : "Add transaction"}
        >
          <AddTransactionForm
            user={user}
            transactionToEdit={transactionToEdit}
            clearEditing={clearEditing}
          />
        </DashboardCard>
      </div>

      <div className="min-w-0 lg:col-start-9 lg:col-end-13 lg:row-start-7 lg:row-end-11">
        <DashboardCard title="Trend">
          <TransactionsTrendChart />
        </DashboardCard>
      </div>

      {isLoadingTransactions && (
        <div className="lg:col-span-12 text-sm opacity-70">
          Loading transactions...
        </div>
      )}
    </section>
  );
}
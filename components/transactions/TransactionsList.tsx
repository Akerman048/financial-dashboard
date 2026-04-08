"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import clsx from "clsx";
import { useFinanceStore } from "@/store/finance.store";
import { Transaction } from "@/types/transaction.types";
import { deleteUserTransaction } from "@/lib/firebase/transactions";
import { useProfileStore } from "@/store/profile.store";
import { formatCurrency } from "@/lib/formatCurrency";

type TransactionFilters = {
  search: string;
  category: string;
  type: "all" | "income" | "expense";
};

type TransactionsListProps = {
  user: User | null;
  onEdit?: (transaction: Transaction) => void;
  limit?: number;
  showPagination?: boolean;
  showActions?: boolean;
  showViewAllLink?: boolean;
  filters?: TransactionFilters;
};

const ITEMS_PER_PAGE = 10;

export default function TransactionsList({
  user,
  onEdit,
  limit,
  showPagination = true,
  showActions = true,
  showViewAllLink = false,
  filters,
}: TransactionsListProps) {
  const transactions = useFinanceStore((state) => state.transactions);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const currency = useProfileStore((state) => state.profile?.currency || "USD");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return sorted.filter((transaction) => {
      const matchesSearch = filters?.search
        ? transaction.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesCategory = filters?.category
        ? transaction.category
            .toLowerCase()
            .includes(filters.category.toLowerCase())
        : true;

      const matchesType =
        filters?.type && filters.type !== "all"
          ? transaction.type === filters.type
          : true;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleTransactions = useMemo(() => {
    if (typeof limit === "number") {
      return filteredTransactions.slice(0, limit);
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage, limit]);

  const handleDelete = async (transactionId: string) => {
    try {
      if (user) {
        await deleteUserTransaction(user.uid, transactionId);
      }

      deleteTransaction(transactionId);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const showDesktopActions = showActions && typeof onEdit === "function";
  const showMobileActions = showActions && typeof onEdit === "function";
  const showDesktopPagination =
    showPagination && typeof limit !== "number" && totalPages > 1;

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4">
      <div className="min-h-0 flex-1">
        <div className="hidden h-full min-h-0 lg:block">
          <div className="h-full min-h-0 overflow-auto scrollbar-thin">
            <div
              className={clsx(
                "min-h-full",
                showDesktopActions ? "min-w-[820px]" : "min-w-[700px]"
              )}
            >
              <div
                className={clsx(
                  "sticky top-0 z-10 grid gap-3 border-b border-border bg-surface px-4 pb-3 pt-1 text-xs uppercase tracking-wide text-muted-foreground",
                  showDesktopActions
                    ? "grid-cols-[100px_120px_90px_minmax(160px,1fr)_100px_120px]"
                    : "grid-cols-[100px_120px_90px_minmax(160px,1fr)_100px]"
                )}
              >
                <span>Date</span>
                <span>Category</span>
                <span>Type</span>
                <span>Title</span>
                <span className="text-right">Amount</span>
                {showDesktopActions && (
                  <span className="text-right">Actions</span>
                )}
              </div>

              <div className="space-y-2 py-3 pr-1">
                {visibleTransactions.length > 0 ? (
                  visibleTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={clsx(
                        "grid items-center gap-3 rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-3 transition hover:bg-[var(--color-hover)]",
                        showDesktopActions
                          ? "grid-cols-[100px_120px_90px_minmax(160px,1fr)_100px_120px]"
                          : "grid-cols-[100px_120px_90px_minmax(160px,1fr)_100px]"
                      )}
                    >
                      <p className="truncate text-sm text-muted-foreground">
                        {transaction.date}
                      </p>

                      <div className="min-w-0 overflow-hidden">
                        <span className="block max-w-full truncate rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {transaction.category}
                        </span>
                      </div>

                      <p
                        className={clsx(
                          "truncate text-sm font-medium capitalize",
                          transaction.type === "income"
                            ? "text-[var(--success)]"
                            : "text-[var(--danger)]"
                        )}
                      >
                        {transaction.type}
                      </p>

                      <p className="truncate font-medium text-foreground">
                        {transaction.title}
                      </p>

                      <p className="truncate text-right font-semibold tabular-nums text-foreground">
                        {formatCurrency(transaction.amount, currency)}
                      </p>

                      {showDesktopActions && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit?.(transaction)}
                            className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-[var(--color-hover)]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(transaction.id)}
                            className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-6 text-sm text-muted-foreground">
                    No transactions found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {visibleTransactions.length > 0 ? (
            visibleTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="space-y-3 rounded-xl border border-border bg-[var(--surface-elevated)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                    <p className="truncate text-lg font-semibold text-foreground">
                      {transaction.title}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-bold text-foreground">
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="max-w-full truncate rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {transaction.category}
                  </span>

                  <span
                    className={clsx(
                      "rounded-full bg-muted px-2 py-1 text-xs font-medium capitalize",
                      transaction.type === "income"
                        ? "text-[var(--success)]"
                        : "text-[var(--danger)]"
                    )}
                  >
                    {transaction.type}
                  </span>
                </div>

                {showMobileActions && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(transaction)}
                      className="flex-1 rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(transaction.id)}
                      className="flex-1 rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-[var(--danger)]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-6 text-sm text-muted-foreground">
              No transactions found.
            </div>
          )}
        </div>
      </div>

      {showDesktopPagination && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {showViewAllLink && (
        <div className="border-t border-border pt-4">
          <Link
            href="/transactions"
            className="inline-flex rounded-xl border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
          >
            View all transactions
          </Link>
        </div>
      )}
    </div>
  );
}
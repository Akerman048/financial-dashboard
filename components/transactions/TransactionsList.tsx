"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useFinanceStore } from "@/store/finance.store";
import { Transaction } from "@/types/transaction.types";

type TransactionFilters = {
  search: string;
  category: string;
  type: "all" | "income" | "expense";
};

type TransactionsListProps = {
  onEdit?: (transaction: Transaction) => void;
  limit?: number;
  showPagination?: boolean;
  showActions?: boolean;
  showViewAllLink?: boolean;
  filters?: TransactionFilters;
};

const ITEMS_PER_PAGE = 10;

export default function TransactionsList({
  onEdit,
  limit,
  showPagination = true,
  showActions = true,
  showViewAllLink = false,
  filters,
}: TransactionsListProps) {
  const transactions = useFinanceStore((state) => state.transactions);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

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
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, limit]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const showDesktopActions = showActions && typeof onEdit === "function";
  const showMobileActions = showActions && typeof onEdit === "function";
  const showDesktopPagination =
    showPagination && typeof limit !== "number" && totalPages > 1;

  return (
    <div className="flex h-full min-w-0 w-full flex-col gap-4 rounded-xl ">
      <div className="min-h-0 flex-1">
        {/* DESKTOP */}
        <div className="hidden min-h-0 lg:block">
          <div className="overflow-x-auto">
            <div
              className={clsx(
                showDesktopActions ? "min-w-[820px]" : "min-w-[700px]"
              )}
            >
              <div
                className={clsx(
                  "grid gap-3 px-4 pb-3 text-xs uppercase tracking-wide opacity-60",
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

              <div className="space-y-2 pr-1">
                {visibleTransactions.length > 0 ? (
                  visibleTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={clsx(
                        "grid items-center gap-3 rounded-xl border px-4 py-3 transition hover:bg-white/5",
                        showDesktopActions
                          ? "grid-cols-[100px_120px_90px_minmax(160px,1fr)_100px_120px]"
                          : "grid-cols-[100px_120px_90px_minmax(160px,1fr)_100px]"
                      )}
                    >
                      <p className="min-w-0 truncate text-sm opacity-70">
                        {transaction.date}
                      </p>

                      <div className="min-w-0 overflow-hidden">
                        <span className="block max-w-full truncate rounded-full px-2 py-1 text-xs opacity-80">
                          {transaction.category}
                        </span>
                      </div>

                      <p
                        className={clsx(
                          "min-w-0 truncate text-sm capitalize",
                          transaction.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {transaction.type}
                      </p>

                      <p className="min-w-0 truncate font-medium">
                        {transaction.title}
                      </p>

                      <p className="truncate text-right font-semibold tabular-nums">
                        {transaction.amount}
                      </p>

                      {showDesktopActions && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit?.(transaction)}
                            className="rounded-md border px-2 py-1 text-xs transition hover:bg-white/10"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="rounded-md border px-2 py-1 text-xs transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border px-4 py-6 text-sm opacity-70">
                    No transactions found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET */}
        <div className="space-y-3 lg:hidden">
          {visibleTransactions.length > 0 ? (
            visibleTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="space-y-3 rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm opacity-70">{transaction.date}</p>
                    <p className="truncate text-lg font-semibold">
                      {transaction.title}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-bold">
                    {transaction.amount}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="max-w-full truncate rounded-full border px-2 py-1 text-xs opacity-80">
                    {transaction.category}
                  </span>

                  <span
                    className={clsx(
                      "rounded-full border px-2 py-1 text-xs capitalize",
                      transaction.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
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
                      className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border px-4 py-6 text-sm opacity-70">
              No transactions found.
            </div>
          )}
        </div>
      </div>

      {showDesktopPagination && (
        <div className="flex items-center justify-between border-t pt-4">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-sm opacity-70">
            Page {currentPage} of {totalPages}
          </p>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {showViewAllLink && (
        <div className="border-t pt-4">
          <Link
            href="/transactions"
            className="inline-flex rounded-lg border px-4 py-2 text-sm transition hover:bg-white/5"
          >
            View all transactions
          </Link>
        </div>
      )}
    </div>
  );
}
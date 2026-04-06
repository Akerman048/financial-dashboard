"use client";

import { TransactionFilters } from "@/types/transactionFilters.types";

type TransactionsFiltersProps = {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
};

export default function TransactionsFilters({
  filters,
  onChange,
}: TransactionsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3 lg:flex-row">
      <input
        type="text"
        placeholder="Search by title..."
        value={filters.search}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value })
        }
        className="flex-1 rounded-lg border px-3 py-2"
      />

      <input
        type="text"
        placeholder="Category..."
        value={filters.category}
        onChange={(e) =>
          onChange({ ...filters, category: e.target.value })
        }
        className="flex-1 rounded-lg border px-3 py-2"
      />

      <select
        value={filters.type}
        onChange={(e) =>
          onChange({
            ...filters,
            type: e.target.value as "all" | "income" | "expense",
          })
        }
        className="rounded-lg border px-3 py-2"
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>
  );
}
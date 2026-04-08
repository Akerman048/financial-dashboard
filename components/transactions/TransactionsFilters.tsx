"use client";

import { TransactionFilters } from "@/types/TransactionFilters";

type TransactionsFiltersProps = {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
};

const fieldClassName =
  "w-full min-w-0 rounded-xl border border-border bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-foreground transition outline-none placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring";

export default function TransactionsFilters({
  filters,
  onChange,
}: TransactionsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <input
        type="text"
        placeholder="Search by title..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className={fieldClassName}
      />

      <input
        type="text"
        placeholder="Category..."
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className={fieldClassName}
      />

      <select
        value={filters.type}
        onChange={(e) =>
          onChange({
            ...filters,
            type: e.target.value as "all" | "income" | "expense",
          })
        }
        className="w-full shrink-0 rounded-xl border border-border bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-foreground transition outline-none focus:border-transparent focus:ring-2 focus:ring-ring lg:w-[170px]"
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>
  );
}
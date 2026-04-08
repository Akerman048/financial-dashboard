"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/store/finance.store";
import { useProfileStore } from "@/store/profile.store";
import { formatCurrency } from "@/lib/formatCurrency";
import StatCard from "./StatCard";

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function OverviewStats() {
  const transactions = useFinanceStore((state) => state.transactions);
  const currency = useProfileStore((state) => state.profile?.currency || "USD");

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let incomeCurrent = 0;
    let incomePrev = 0;
    let expensesCurrent = 0;
    let expensesPrev = 0;
    let transactionsThisMonth = 0;

    transactions.forEach((t) => {
      const d = parseLocalDate(t.date);
      if (Number.isNaN(d.getTime())) return;

      const month = d.getMonth();
      const year = d.getFullYear();

      const isCurrent = month === currentMonth && year === currentYear;
      const isPrev = month === prevMonth && year === prevYear;

      if (isCurrent) transactionsThisMonth++;

      if (t.type === "income") {
        if (isCurrent) incomeCurrent += t.amount;
        if (isPrev) incomePrev += t.amount;
      } else {
        if (isCurrent) expensesCurrent += t.amount;
        if (isPrev) expensesPrev += t.amount;
      }
    });

    const balanceCurrent = incomeCurrent - expensesCurrent;
    const balancePrev = incomePrev - expensesPrev;

    const calcChange = (current: number, prev: number) => {
      if (prev === 0) return null;
      return ((current - prev) / prev) * 100;
    };

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      transactionsThisMonth,
      incomeChange: calcChange(incomeCurrent, incomePrev),
      expensesChange: calcChange(expensesCurrent, expensesPrev),
      balanceChange: calcChange(balanceCurrent, balancePrev),
    };
  }, [transactions, currency]);

  const formatChange = (value: number | null) => {
    if (value === null) return "No previous data";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}% vs last month`;
  };

  return (
    <div className="grid min-h-0 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <StatCard
        label="Total balance"
        value={formatCurrency(stats.totalBalance, currency)}
        change={formatChange(stats.balanceChange)}
        tone={stats.totalBalance >= 0 ? "positive" : "negative"}
      />

      <StatCard
        label="Total income"
        value={formatCurrency(stats.totalIncome, currency)}
        change={formatChange(stats.incomeChange)}
        tone="positive"
      />

      <StatCard
        label="Total expenses"
        value={formatCurrency(stats.totalExpenses, currency)}
        change={formatChange(stats.expensesChange)}
        tone="negative"
      />

      <StatCard
        label="Transactions this month"
        value={String(stats.transactionsThisMonth)}
        tone="neutral"
      />
    </div>
  );
}
"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/store/finance.store";
import StatCard from "./StatCard";

export default function OverviewStats() {
  const transactions = useFinanceStore((state) => state.transactions);

  const stats = useMemo(() => {
    // --- ALL TIMES  ---
    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    // --- DATES ---
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // --- VARIABLES FOR MONTHS ---
    let incomeCurrent = 0;
    let incomePrev = 0;

    let expensesCurrent = 0;
    let expensesPrev = 0;

    let transactionsThisMonth = 0;

    transactions.forEach((t) => {
      const d = new Date(t.date);
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

    // --- FUNCTION CHANGE ---
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
  }, [transactions]);

  // --- FORMATTING ---
  const formatChange = (value: number | null) => {
    if (value === null) return "—";

    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}% vs last month`;
  };

  return (
    <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <StatCard
        label="Total balance"
        value={`$${stats.totalBalance.toLocaleString()}`}
        change={formatChange(stats.balanceChange)}
      />

      <StatCard
        label="Total income"
        value={`$${stats.totalIncome.toLocaleString()}`}
        change={formatChange(stats.incomeChange)}
      />

      <StatCard
        label="Total expenses"
        value={`$${stats.totalExpenses.toLocaleString()}`}
        change={formatChange(stats.expensesChange)}
      />

      <StatCard
        label="Transactions this month"
        value={String(stats.transactionsThisMonth)}
      />
    </div>
  );
}
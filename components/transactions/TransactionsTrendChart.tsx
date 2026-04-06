"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useFinanceStore } from "@/store/finance.store";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function getCssVar(name: string) {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const normalized =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanHex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLastMonths(count: number) {
  const months: { key: string; label: string }[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    const label = date.toLocaleString("en-US", { month: "short" });

    months.push({ key, label });
  }

  return months;
}

export default function TransactionsTrendChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const [themeKey, setThemeKey] = useState("");

  useEffect(() => {
    const syncTheme = () => {
      setThemeKey(
        document.documentElement.getAttribute("data-theme") || "light"
      );
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const { data, options, totalTransactions, currentMonthCount } = useMemo(() => {
    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#b0b3b8";
    const border = getCssVar("--border") || "rgba(255,255,255,0.08)";
    const card = getCssVar("--card") || "#17191b";

    const barColor = "#1d8fff";
    const hoverColor = "#4ea8ff";

    const months = getLastMonths(6);

    const countsMap = new Map<string, number>();

    months.forEach((month) => {
      countsMap.set(month.key, 0);
    });

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);

      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      if (countsMap.has(key)) {
        countsMap.set(key, (countsMap.get(key) || 0) + 1);
      }
    });

    const labels = months.map((month) => month.label);
    const values = months.map((month) => countsMap.get(month.key) || 0);

    const totalTransactions = values.reduce((sum, value) => sum + value, 0);
    const currentMonthCount = values[values.length - 1] || 0;

    const data = {
      labels,
      datasets: [
        {
          label: "Transactions",
          data: values,
          backgroundColor: values.map((_, index) =>
            index === values.length - 1 ? hoverColor : barColor
          ),
          borderRadius: 10,
          borderSkipped: false as const,
          barThickness: 42,
        },
      ],
    };

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: card,
          titleColor: foreground,
          bodyColor: foreground,
          borderColor: border,
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label(context) {
              return `${context.parsed.y} transactions`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: mutedForeground,
            font: {
              size: 12,
              weight: 600,
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: mutedForeground,
          },
          grid: {
            color: hexToRgba("#ffffff", 0.08),
          },
          border: {
            display: false,
          },
        },
      },
    };

    return { data, options, totalTransactions, currentMonthCount };
  }, [transactions, themeKey]);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm opacity-70">Transactions activity</p>
          <p className="mt-1 text-3xl font-bold">{totalTransactions}</p>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-70">This month</p>
          <p className="mt-1 text-xl font-semibold">{currentMonthCount}</p>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
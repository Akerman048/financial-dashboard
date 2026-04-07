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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

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

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

type MonthBucket = {
  key: string;
  label: string;
  year: number;
  month: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#8b5cf6",
  Food: "#f97316",
  Transport: "#3b82f6",
  Shopping: "#eab308",
  Health: "#10b981",
  Entertainment: "#ef4444",
  Education: "#06b6d4",
  Bills: "#a855f7",
  Travel: "#ec4899",
  Other: "#94a3b8",
};

export default function ExpensesAnalyticsChart() {
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

  const { data, options, totalSpent } = useMemo(() => {
    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#94a3b8";
    const border = getCssVar("--border") || "rgba(255,255,255,0.08)";
    const card = getCssVar("--card") || "#17191b";

    const expenseTransactions = transactions.filter(
      (item) => item.type === "expense"
    );

    const now = new Date();
    const monthBuckets: MonthBucket[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthBuckets.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }

    const labels = monthBuckets.map((bucket) => bucket.label);

    const categorySet = new Set<string>();
    expenseTransactions.forEach((t) => {
      categorySet.add(t.category || "Other");
    });

    const categories = Array.from(categorySet);

    const monthlyCategoryMap: Record<string, Record<string, number>> = {};

    monthBuckets.forEach((bucket) => {
      monthlyCategoryMap[bucket.key] = {};
      categories.forEach((category) => {
        monthlyCategoryMap[bucket.key][category] = 0;
      });
    });

    expenseTransactions.forEach((t) => {
      const d = parseLocalDate(t.date);
      if (Number.isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyCategoryMap[key]) return;

      const category = t.category || "Other";
      monthlyCategoryMap[key][category] =
        (monthlyCategoryMap[key][category] || 0) + t.amount;
    });

    const datasets = categories.map((category) => ({
      label: category,
      data: monthBuckets.map(
        (bucket) => monthlyCategoryMap[bucket.key][category] || 0
      ),
      backgroundColor: hexToRgba(
        CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
        0.85
      ),
      borderColor: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false as const,
      stack: "expenses",
      barThickness: 28,
    }));

    const totalSpent = expenseTransactions.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const data = {
      labels,
      datasets,
    };

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: mutedForeground,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: card,
          titleColor: foreground,
          bodyColor: foreground,
          borderColor: border,
          borderWidth: 1,
          callbacks: {
            title(items) {
              const index = items[0]?.dataIndex ?? 0;
              const bucket = monthBuckets[index];
              return `${bucket.label} ${bucket.year}`;
            },
            label(context) {
              const label = context.dataset.label || "";
              const value = Number(context.parsed.y || 0);
              return `${label}: $${value.toLocaleString()}`;
            },
            footer(items) {
              const total = items.reduce(
                (sum, item) => sum + Number(item.parsed.y || 0),
                0
              );
              return `Total: $${total.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: mutedForeground,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: border,
            borderDash: [4, 4],
          },
          border: {
            display: false,
          },
          ticks: {
            color: mutedForeground,
            callback(value) {
              const num = Number(value);
              if (num >= 1000) {
                return `$${(num / 1000).toFixed(1).replace(".0", "")}K`;
              }
              return `$${num}`;
            },
          },
        },
      },
    };

    return { data, options, totalSpent };
  }, [transactions, themeKey]);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl  border-white/10 bg-surface/70 ">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          
          <p className="mt-1 text-3xl font-bold">
            ${totalSpent.toLocaleString()}
          </p>
          <p className="mt-1 text-sm opacity-60">Last 12 months</p>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
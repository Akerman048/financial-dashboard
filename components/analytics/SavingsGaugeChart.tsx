"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSavingStore } from "@/store/savings.store";
import { useFinanceStore } from "@/store/finance.store";
import { formatCurrency } from "@/lib/formatCurrency";
import { useProfileStore } from "@/store/profile.store";

ChartJS.register(ArcElement, Tooltip, Legend);

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

export default function SavingsGaugeChart() {
  const savings = useSavingStore((state) => state.savings);
  const transactions = useFinanceStore((state) => state.transactions);
  const [themeKey, setThemeKey] = useState("");
  const currency = useProfileStore((state) => state.profile?.currency || "USD");

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

  const { data, options, totalSavings, totalIncome, savedPercent } =
    useMemo(() => {
      const foreground = getCssVar("--foreground") || "#111827";
      const mutedForeground = getCssVar("--muted-foreground") || "#6b7280";
      const border = getCssVar("--border") || "rgba(17, 24, 39, 0.08)";
      const card = getCssVar("--card") || "#ffffff";

      const totalSavings = savings.reduce(
        (sum, goal) => sum + goal.currentAmount,
        0
      );

      const totalIncome = transactions
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0);

      const savedPercent =
        totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

      const labels = savings.map((goal) => goal.title);
      const values = savings.map((goal) => goal.currentAmount);

      const backgroundColors = savings.map((goal) =>
        hexToRgba(goal.color || "#8b5cf6", 0.55)
      );

      const borderColors = savings.map((goal) => goal.color || "#8b5cf6");

      const data = {
        labels,
        datasets: [
          {
            data: values.length ? values : [1],
            backgroundColor: values.length
              ? backgroundColors
              : [hexToRgba("#94a3b8", 0.2)],
            borderColor: values.length ? borderColors : ["#94a3b8"],
            borderWidth: 1,
            hoverOffset: 6,
            cutout: "68%",
            borderRadius: 6,
            spacing: 2,
          },
        ],
      };

      const options: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
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
              label(context) {
                const value = Number(context.parsed || 0);
                const percent =
                  totalSavings > 0 ? (value / totalSavings) * 100 : 0;

                return `${context.label}: ${formatCurrency(
                  value,
                  currency
                )} (${percent.toFixed(1)}%)`;
              },
            },
          },
        },
      };

      return {
        data,
        options,
        totalSavings,
        totalIncome,
        savedPercent,
      };
    }, [savings, transactions, themeKey, currency]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(totalSavings, currency)}
            </p>

            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
              {savedPercent.toFixed(1)}% of income
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Total income: {formatCurrency(totalIncome, currency)}
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
        >
          All time
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <Doughnut data={data} options={options} />

        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totalSavings, currency)}
          </p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total saved
          </p>
        </div>
      </div>
    </div>
  );
}
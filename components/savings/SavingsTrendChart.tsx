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
import { useSavingStore } from "@/store/savings.store";
import { useProfileStore } from "@/store/profile.store";
import {
  formatCurrency,
  formatCompactCurrency,
} from "@/lib/formatCurrency";

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

export default function SavingsTrendChart() {
  const savings = useSavingStore((state) => state.savings);
  const currency = useProfileStore((state) => state.profile?.currency || "USD");
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

  const { data, options, total } = useMemo(() => {
    const foreground = getCssVar("--foreground") || "#111827";
    const mutedForeground = getCssVar("--muted-foreground") || "#6b7280";
    const border = getCssVar("--border") || "rgba(17, 24, 39, 0.08)";
    const card = getCssVar("--card") || "#ffffff";

    const total = savings.reduce((sum, goal) => sum + goal.currentAmount, 0);

    const labels = savings.map((goal) => goal.title);
    const values = savings.map((goal) => goal.currentAmount);

    const data = {
      labels,
      datasets: [
        {
          label: "Savings",
          data: values,
          backgroundColor: savings.map((goal) => hexToRgba(goal.color, 0.6)),
          borderRadius: 8,
          borderSkipped: false as const,
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
          callbacks: {
            label(context) {
              return formatCurrency(Number(context.parsed.y), currency);
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: mutedForeground,
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
            color: mutedForeground,
            callback(value) {
              return formatCompactCurrency(Number(value), currency);
            },
          },
          grid: {
            color: border,
            borderDash: [4, 4],
          },
          border: {
            display: false,
          },
        },
      },
    };

    return { data, options, total };
  }, [savings, themeKey, currency]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Savings by goal
          </p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {formatCurrency(total, currency)}
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
        >
          All goals
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
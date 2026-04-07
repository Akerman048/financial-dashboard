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

export default function SavingsByGoalChart() {
  const savings = useSavingStore((state) => state.savings);
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
    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#b0b3b8";
    const border = getCssVar("--border") || "rgba(255,255,255,0.08)";
    const card = getCssVar("--card") || "#17191b";

    const total = savings.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0
    );

    const labels = savings.map((goal) => goal.title);
    const values = savings.map((goal) => goal.currentAmount);

    const baseColor = "#ef6a52";

    const data = {
      labels,
      datasets: [
  {
    label: "Savings",
    data: values,
    backgroundColor: savings.map((goal) =>
      hexToRgba(goal.color, 0.6)
    ),
    borderRadius: 8,
    borderSkipped: false,
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
              return `$${Number(context.parsed.y).toLocaleString()}`;
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
              const num = Number(value);
              if (num >= 1000) {
                return `${(num / 1000).toFixed(1).replace(".0", "")}K`;
              }
              return `${num}`;
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
  }, [savings, themeKey]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-60">
            Savings by goal
          </p>
          <p className="mt-1 text-3xl font-bold">
            ${total.toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm opacity-80"
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
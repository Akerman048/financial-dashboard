"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useFinanceStore } from "@/store/finance.store";
import { useProfileStore } from "@/store/profile.store";
import {
  formatCurrency,
  formatCompactCurrency,
} from "@/lib/formatCurrency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
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

export default function CashflowChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const currency = useProfileStore((state) => state.profile?.currency || "USD");
  const [themeKey, setThemeKey] = useState("light");

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

  const { data, options } = useMemo(() => {
    const now = new Date();

    const labels: string[] = [];
    const incomeData = Array(6).fill(0);
    const expenseData = Array(6).fill(0);

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      labels.push(
        date.toLocaleString("en-US", {
          month: "short",
        })
      );
    }

    transactions.forEach((transaction) => {
      const date = parseLocalDate(transaction.date);

      if (Number.isNaN(date.getTime())) return;

      const diffMonths =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      if (diffMonths < 0 || diffMonths >= 6) return;

      const index = 5 - diffMonths;

      if (transaction.type === "income") {
        incomeData[index] += transaction.amount;
      } else {
        expenseData[index] += transaction.amount;
      }
    });

    const foreground = getCssVar("--foreground") || "#111827";
    const mutedForeground = getCssVar("--muted-foreground") || "#6b7280";
    const border = getCssVar("--border") || "rgba(17, 24, 39, 0.08)";
    const card = getCssVar("--card") || "#ffffff";

    const incomeColor = "#22c55e";
    const expenseColor = "#ef4444";

    const data = {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: incomeColor,
          backgroundColor: hexToRgba(incomeColor, 0.16),
          pointBackgroundColor: incomeColor,
          pointBorderColor: incomeColor,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2.5,
          tension: 0.35,
          fill: false,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: expenseColor,
          backgroundColor: hexToRgba(expenseColor, 0.16),
          pointBackgroundColor: expenseColor,
          pointBorderColor: expenseColor,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2.5,
          tension: 0.35,
          fill: false,
        },
      ],
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          align: "start",
          labels: {
            color: foreground,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        tooltip: {
          backgroundColor: card,
          titleColor: foreground,
          bodyColor: foreground,
          borderColor: border,
          borderWidth: 1,
          displayColors: true,
          padding: 12,
          callbacks: {
            label(context) {
              const label = context.dataset.label || "";
              const value = Number(context.parsed.y || 0);
              return `${label}: ${formatCurrency(value, currency)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: mutedForeground,
            font: {
              size: 12,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: border,
            borderDash: [4, 4],
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: mutedForeground,
            font: {
              size: 12,
            },
            callback(value) {
              return formatCompactCurrency(Number(value), currency);
            },
          },
        },
      },
    };

    return { data, options };
  }, [transactions, themeKey, currency]);

  return (
    <div className="h-[280px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}
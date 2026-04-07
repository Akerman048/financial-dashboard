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

export default function CashflowChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const [themeKey, setThemeKey] = useState("");

  useEffect(() => {
    const syncTheme = () => {
      setThemeKey(document.documentElement.getAttribute("data-theme") || "light");
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
      const date = new Date(transaction.date);

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

    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#b0b3b8";
    const border = getCssVar("--border") || "rgba(255,255,255,0.08)";
    const card = getCssVar("--card") || "#17191b";

    const incomeColor = "#22c55e";
    const expenseColor = "#f54257";

    const data = {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: incomeColor,
          backgroundColor: hexToRgba(incomeColor, 0.18),
          pointBackgroundColor: incomeColor,
          pointBorderColor: incomeColor,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.35,
          fill: false,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: expenseColor,
          backgroundColor: hexToRgba(expenseColor, 0.18),
          pointBackgroundColor: expenseColor,
          pointBorderColor: expenseColor,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
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
          },
        },
        tooltip: {
          backgroundColor: card,
          titleColor: foreground,
          bodyColor: foreground,
          borderColor: border,
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            label(context) {
              const label = context.dataset.label || "";
              const value = context.parsed.y || 0;
              return `${label}: $${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
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
              return `$${Number(value).toLocaleString()}`;
            },
          },
        },
      },
    };

    return { data, options };
  }, [transactions, themeKey]);

  return (
    <div className="h-[260px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useFinanceStore } from "@/store/finance.store";

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

const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    const total = chart.config.data.datasets?.[0]?.data?.reduce((sum, value) => {
      return sum + Number(value || 0);
    }, 0);

    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#b0b3b8";

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = foreground;
    ctx.font = "700 28px sans-serif";
    ctx.fillText(`${Math.round(Number(total || 0) / 1000)}K`, centerX, centerY - 10);

    ctx.fillStyle = mutedForeground;
    ctx.font = "400 12px sans-serif";
    ctx.fillText("Total Balance", centerX, centerY + 18);

    ctx.restore();
  },
};

export default function CategoryBreakdownChart() {
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
    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#b0b3b8";
    const card = getCssVar("--card") || "#17191b";
    const border = getCssVar("--border") || "rgba(255,255,255,0.08)";

    const incomeColor = "#38bdf8";
    const expenseColor = "#bae6fd";

    const data = {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [totalIncome, totalExpenses],
          backgroundColor: [incomeColor, expenseColor],
          borderColor: card,
          borderWidth: 6,
          hoverOffset: 4,
          borderRadius: 6,
          cutout: "68%",
        },
      ],
    };

    const options: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: foreground,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 10,
            boxHeight: 10,
            padding: 18,
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
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: $${value.toLocaleString()}`;
            },
          },
        },
      },
    };

    return { data, options };
  }, [transactions, themeKey]);

  return (
  <div className="flex h-full w-full items-center justify-center">
    <div className="h-[260px] w-full max-w-[320px]">
      <Doughnut
        data={data}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  </div>
);
}
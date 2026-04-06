"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
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
  const [themeKey, setThemeKey] = useState("");

  useEffect(() => {
    const syncTheme = () => {
      setThemeKey(
        document.documentElement.getAttribute("data-theme") || "light",
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

  const { data, options, total, change } = useMemo(() => {
    const foreground = getCssVar("--foreground") || "#ffffff";
    const mutedForeground = getCssVar("--muted-foreground") || "#b0b3b8";
    const border = getCssVar("--border") || "rgba(255,255,255,0.08)";
    const card = getCssVar("--card") || "#17191b";

    const lineColor = "#ef6a52";

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const values = [620, 1180, 520, 180, 540, 260, 510];

    const total = 2512.4;
    const change = -2;

    const data = {
      labels,
      datasets: [
        {
          data: values,
          borderColor: lineColor,
          backgroundColor: hexToRgba(lineColor, 0.18),
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };

    const options: ChartOptions<"line"> = {
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
            color: border,
            borderDash: [4, 4],
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
            display: false,
          },
          border: {
            display: false,
          },
        },
      },
    };

    return { data, options, total, change };
  }, [themeKey]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-60">Savings</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-3xl font-bold">${total.toLocaleString()}</p>
            <p className={change < 0 ? "text-sm text-red-400" : "text-sm text-green-400"}>
              {change > 0 ? "+" : ""}
              {change}%
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm opacity-80"
        >
          This year
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
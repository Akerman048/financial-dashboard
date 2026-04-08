"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile.store";
import { formatCurrency } from "@/lib/formatCurrency";

const fieldClassName =
  "w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-foreground transition outline-none placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring";

export default function SavingsCalculatorCard() {
  const currency = useProfileStore((state) => state.profile?.currency || "USD");

  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [monthly, setMonthly] = useState("");

  const parsedTarget = Number(target) || 0;
  const parsedCurrent = Number(current) || 0;
  const parsedMonthly = Number(monthly) || 0;

  const handleReset = () => {
    setTarget("");
    setCurrent("");
    setMonthly("");
  };

  const remaining = Math.max(parsedTarget - parsedCurrent, 0);
  const months =
    parsedMonthly > 0 ? Math.ceil(remaining / parsedMonthly) : null;

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={`Target (${currency})`}
          className={fieldClassName}
        />

        <input
          type="number"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={`Current (${currency})`}
          className={fieldClassName}
        />

        <input
          type="number"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          placeholder={`Monthly (${currency})`}
          className={fieldClassName}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-medium text-muted-foreground">Remaining</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(remaining, currency)}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-medium text-muted-foreground">
            Months needed
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {months === null ? "—" : months}
          </p>
          {months === null && (
            <p className="mt-1 text-xs text-muted-foreground">
              Enter monthly amount
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="mt-auto w-full cursor-pointer rounded-xl border border-border bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
      >
        Reset
      </button>
    </section>
  );
}
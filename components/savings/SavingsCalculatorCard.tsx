"use client";

import { useState } from "react";

export default function SavingsCalculatorCard() {
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
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target (5000)"
          className="rounded-lg border px-3 py-2"
        />

        <input
          type="number"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Current (1500)"
          className="rounded-lg border px-3 py-2"
        />

        <input
          type="number"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          placeholder="Monthly (300)"
          className="rounded-lg border px-3 py-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-70">Remaining</p>
          <p className="text-2xl font-bold">{remaining}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-70">Months needed</p>
          <p className="text-xl md:text-base font-bold">
            {months === null ? "Enter monthly amount" : months}
          </p>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full rounded-lg border px-4 py-2 cursor-pointer"
      >
        Reset
      </button>
    </section>
  );
}
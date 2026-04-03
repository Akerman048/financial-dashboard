"use client";

import { useState } from "react";
import { SavingsGoal } from "@/types/savings.types";
import { calculateProgress } from "@/lib/savings/calculateProgress";
import { savingsCategoryMeta } from "@/lib/savings/savingsCategoryMeta";
import { useSavingStore } from "@/store/savings.store";

type SavingsGoalCardProps = {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
};

export default function SavingsGoalCard({
  goal,
  onEdit,
}: SavingsGoalCardProps) {
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const [amount, setAmount] = useState("");

  const updateSum = useSavingStore((state) => state.updateCurrentAmount);
  const deleteGoal = useSavingStore((state) => state.deleteGoal);

  const category = savingsCategoryMeta[goal.category];
  const Icon = category.icon;

  const handleSaveAmount = () => {
    if (!amount.trim()) return;

    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount)) return;

    updateSum(goal.id, parsedAmount);
    setAmount("");
  };

  return (
    <div className="min-w-0 rounded-2xl border p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold">{goal.title}</h3>
            <p className="text-sm opacity-70">{category.label}</p>
          </div>
        </div>

        <span
          className="shrink-0 rounded-full px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
        >
          {Math.round(progress)}%
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between gap-3 text-sm">
          <span>{goal.currentAmount} saved</span>
          <span>{goal.targetAmount} target</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: goal.color }}
          />
        </div>

        <p className="text-sm opacity-70">{remaining} left</p>
      </div>

      <div className="space-y-2">
        <label className="block space-y-1">
          <span className="text-sm">Update savings amount</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Use negative value to subtract"
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>

        <button
          type="button"
          onClick={handleSaveAmount}
          className="w-full rounded-lg border px-4 py-2 cursor-pointer"
        >
          Save
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(goal)}
          className="flex-1 rounded-lg border px-4 py-2 cursor-pointer"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => deleteGoal(goal.id)}
          className="flex-1 rounded-lg border px-4 py-2 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
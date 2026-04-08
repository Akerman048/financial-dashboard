"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useProfileStore } from "@/store/profile.store";
import { useSavingStore } from "@/store/savings.store";
import { SavingsCategory, SavingsGoal } from "@/types/savings.types";
import { savingsCategoryMeta } from "@/lib/savings/savingsCategoryMeta";
import {
  createUserSavingsGoal,
  updateUserSavingsGoal,
} from "@/lib/firebase/savings";

type SavingsGoalFormProps = {
  goalToEdit?: SavingsGoal | null;
  clearEditing?: () => void;
  user: User | null;
};

const fieldClassName =
  "w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-foreground transition outline-none placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring";

export default function SavingsGoalForm({
  goalToEdit = null,
  clearEditing,
  user,
}: SavingsGoalFormProps) {
  const addGoal = useSavingStore((state) => state.addGoal);
  const updateGoal = useSavingStore((state) => state.updateGoal);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SavingsCategory>("Other");
  const [color, setColor] = useState("#8b5cf6");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const currency = useProfileStore((state) => state.profile?.currency || "USD");

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setCategory(goalToEdit.category);
      setColor(goalToEdit.color);
      setTargetAmount(String(goalToEdit.targetAmount));
      setCurrentAmount(String(goalToEdit.currentAmount));
    } else {
      setTitle("");
      setCategory("Other");
      setColor("#8b5cf6");
      setTargetAmount("");
      setCurrentAmount("");
    }
  }, [goalToEdit]);

  const resetForm = () => {
    setTitle("");
    setCategory("Other");
    setColor("#8b5cf6");
    setTargetAmount("");
    setCurrentAmount("");
    clearEditing?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTarget = Number(targetAmount);
    const parsedCurrent = Number(currentAmount);

    if (!title.trim()) return;
    if (!parsedTarget || parsedTarget <= 0) return;
    if (parsedCurrent < 0) return;

    const safeCurrent = Math.min(parsedCurrent, parsedTarget);

    try {
      if (goalToEdit) {
        const updatedGoal: SavingsGoal = {
          ...goalToEdit,
          title: title.trim(),
          category,
          color,
          targetAmount: parsedTarget,
          currentAmount: safeCurrent,
        };

        if (user) {
          await updateUserSavingsGoal(user.uid, updatedGoal);
        }

        updateGoal(updatedGoal);
      } else {
        const newGoal: SavingsGoal = {
          id: crypto.randomUUID(),
          title: title.trim(),
          category,
          color,
          targetAmount: parsedTarget,
          currentAmount: safeCurrent,
          createdAt: new Date().toISOString().slice(0, 10),
        };

        if (user) {
          await createUserSavingsGoal(user.uid, newGoal);
        }

        addGoal(newGoal);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save goal:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col gap-4">
      {goalToEdit && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-muted-foreground">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Trip to Japan"
            className={fieldClassName}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SavingsCategory)}
            className={fieldClassName}
          >
            {Object.entries(savingsCategoryMeta).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            Target amount
          </span>
          <input
            type="number"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder={`Target amount (${currency})`}
            className={fieldClassName}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            Current amount
          </span>
          <input
            type="number"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder={`Current amount (${currency})`}
            className={fieldClassName}
          />
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-muted-foreground">Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-border bg-[var(--surface-elevated)] px-2 py-1"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-auto w-full cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        {goalToEdit ? "Save changes" : "Add goal"}
      </button>
    </form>
  );
}
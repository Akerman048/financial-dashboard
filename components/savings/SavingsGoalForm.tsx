"use client";

import { useState } from "react";
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

type SavingsGoalFormState = {
  title: string;
  category: SavingsCategory;
  color: string;
  targetAmount: string;
  currentAmount: string;
};

const fieldClassName =
  "w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-foreground transition outline-none placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring";

function getInitialFormState(goalToEdit: SavingsGoal | null): SavingsGoalFormState {
  if (!goalToEdit) {
    return {
      title: "",
      category: "Other",
      color: "#8b5cf6",
      targetAmount: "",
      currentAmount: "",
    };
  }

  return {
    title: goalToEdit.title,
    category: goalToEdit.category,
    color: goalToEdit.color,
    targetAmount: String(goalToEdit.targetAmount),
    currentAmount: String(goalToEdit.currentAmount),
  };
}

export default function SavingsGoalForm({
  goalToEdit = null,
  clearEditing,
  user,
}: SavingsGoalFormProps) {
  const addGoal = useSavingStore((state) => state.addGoal);
  const updateGoal = useSavingStore((state) => state.updateGoal);
  const currency = useProfileStore((state) => state.profile?.currency || "USD");

  const [form, setForm] = useState<SavingsGoalFormState>(() =>
    getInitialFormState(goalToEdit)
  );

  const resetForm = () => {
    setForm(getInitialFormState(null));
    clearEditing?.();
  };

  const updateField = <K extends keyof SavingsGoalFormState>(
    key: K,
    value: SavingsGoalFormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedTarget = Number(form.targetAmount);
    const parsedCurrent = Number(form.currentAmount);

    if (!form.title.trim()) return;
    if (!parsedTarget || parsedTarget <= 0) return;
    if (parsedCurrent < 0) return;

    const safeCurrent = Math.min(parsedCurrent, parsedTarget);

    try {
      if (goalToEdit) {
        const updatedGoal: SavingsGoal = {
          ...goalToEdit,
          title: form.title.trim(),
          category: form.category,
          color: form.color,
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
          title: form.title.trim(),
          category: form.category,
          color: form.color,
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
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Trip to Japan"
            className={fieldClassName}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            Category
          </span>
          <select
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value as SavingsCategory)
            }
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
            value={form.targetAmount}
            onChange={(e) => updateField("targetAmount", e.target.value)}
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
            value={form.currentAmount}
            onChange={(e) => updateField("currentAmount", e.target.value)}
            placeholder={`Current amount (${currency})`}
            className={fieldClassName}
          />
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-muted-foreground">Color</span>
          <input
            type="color"
            value={form.color}
            onChange={(e) => updateField("color", e.target.value)}
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
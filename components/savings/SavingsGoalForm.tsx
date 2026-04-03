"use client";

import { useEffect, useState } from "react";
import { useSavingStore } from "@/store/savings.store";
import { SavingsCategory, SavingsGoal } from "@/types/savings.types";
import { savingsCategoryMeta } from "@/lib/savings/savingsCategoryMeta";

type SavingsGoalFormProps = {
  goalToEdit?: SavingsGoal | null;
  clearEditing?: () => void;
};

export default function SavingsGoalForm({
  goalToEdit = null,
  clearEditing,
}: SavingsGoalFormProps) {
  const addGoal = useSavingStore((state) => state.addGoal);
  const updateGoal = useSavingStore((state) => state.updateGoal);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SavingsCategory>("Other");
  const [color, setColor] = useState("#8b5cf6");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTarget = Number(targetAmount);
    const parsedCurrent = Number(currentAmount);

    if (!title.trim()) return;
    if (!parsedTarget || parsedTarget <= 0) return;
    if (parsedCurrent < 0) return;

    const safeCurrent = Math.min(parsedCurrent, parsedTarget);

    if (goalToEdit) {
      updateGoal({
        ...goalToEdit,
        title: title.trim(),
        category,
        color,
        targetAmount: parsedTarget,
        currentAmount: safeCurrent,
      });
    } else {
      addGoal({
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        color,
        targetAmount: parsedTarget,
        currentAmount: safeCurrent,
        createdAt: new Date().toISOString().slice(0, 10),
      });
    }

    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border p-4 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {goalToEdit ? "Edit savings goal" : "Create savings goal"}
        </h2>

        {goalToEdit && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border px-3 py-2"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Trip to Japan"
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SavingsCategory)}
            className="w-full rounded-lg border px-3 py-2"
          >
            {Object.entries(savingsCategoryMeta).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm">Target amount</span>
          <input
            type="number"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="2500"
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm">Current amount</span>
          <input
            type="number"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="500"
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm">Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-full rounded-lg border px-2 py-1"
          />
        </label>
      </div>

      <button type="submit" className=" w-full rounded-lg border px-4 py-2 cursor-pointer">
        {goalToEdit ? "Save changes" : "Add goal"}
      </button>
    </form>
  );
}

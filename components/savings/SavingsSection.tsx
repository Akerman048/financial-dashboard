"use client";

import { useState } from "react";
import { SavingsGoal } from "@/types/savings.types";
import SavingsGoalForm from "./SavingsGoalForm";
import SavingsGoalsList from "./SavingsGoalList";
import clsx from "clsx";

export default function SavingsSection() {
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);

  const clearEditing = () => setGoalToEdit(null);

  return (
    <section
      className={clsx(
        "w-full min-w-0 rounded-xl border p-3",
        "flex flex-col gap-4",
        "lg:grid lg:grid-cols-12 lg:grid-rows-3 lg:gap-4",
        "lg:col-start-1 lg:col-end-13 lg:row-start-1 lg:row-end-4",
      )}
    >
      <SavingsGoalsList onEdit={setGoalToEdit} />
      <SavingsGoalForm goalToEdit={goalToEdit} clearEditing={clearEditing} />
    </section>
  );
}

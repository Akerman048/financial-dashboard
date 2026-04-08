"use client";

import { useRef } from "react";
import type { User } from "firebase/auth";
import { useSavingStore } from "@/store/savings.store";
import SavingsGoalCard from "./SavingsGoalCard";
import { SavingsGoal } from "@/types/savings.types";

type SavingsGoalsListProps = {
  onEdit: (goal: SavingsGoal) => void;
  user: User | null;
};

export default function SavingsGoalsList({
  onEdit,
  user,
}: SavingsGoalsListProps) {
  const savings = useSavingStore((state) => state.savings);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">Savings</h1>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <div className="flex shrink-0 gap-2">
            <button
              onClick={scrollLeft}
              className="cursor-pointer rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
              type="button"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="cursor-pointer rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
              type="button"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="hide-scrollbar w-full min-h-0 overflow-visible lg:overflow-x-auto"
      >
        <div className="flex flex-col gap-4 lg:w-max lg:flex-row lg:pb-2">
          {savings.map((goal) => (
            <div
              key={goal.id}
              className="w-full min-w-0 lg:w-[320px] lg:shrink-0"
            >
              <SavingsGoalCard goal={goal} onEdit={onEdit} user={user} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
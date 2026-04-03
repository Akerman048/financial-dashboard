"use client";

import { useRef } from "react";
import { useSavingStore } from "@/store/savings.store";
import SavingsGoalCard from "./SavingsGoalCard";
import clsx from "clsx";
import { SavingsGoal } from "@/types/savings.types";

type SavingsGoalsListProps = {
  onEdit: (goal: SavingsGoal) => void;
};

export default function SavingsGoalsList({ onEdit }: SavingsGoalsListProps) {
  const savings = useSavingStore((state) => state.savings);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section
      className={clsx(
        "w-full min-w-0 space-y-4 rounded-xl border p-3",
        "lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-4",
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Savings</h1>

        <div className="hidden lg:flex items-center justify-end gap-3">
          <div className="flex shrink-0 gap-2">
            <button
              onClick={scrollLeft}
              className="rounded-lg border px-3 py-2 cursor-pointer"
              type="button"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="rounded-lg border px-3 py-2 cursor-pointer"
              type="button"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-visible lg:overflow-x-auto hide-scrollbar"
      >
        <div className="flex flex-col gap-4 lg:w-max lg:flex-row lg:pb-2">
          {savings.map((goal) => (
            <div
              key={goal.id}
              className="w-full min-w-0 lg:basis-[320px] lg:flex-1"
            >
              <SavingsGoalCard goal={goal} onEdit={onEdit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

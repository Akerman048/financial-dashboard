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
    <section className="w-full min-w-0 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Savings</h1>

        <div className="hidden lg:flex items-center justify-end gap-3">
          <div className="flex shrink-0 gap-2">
            <button
              onClick={scrollLeft}
              className="cursor-pointer rounded-lg border px-3 py-2"
              type="button"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="cursor-pointer rounded-lg border px-3 py-2"
              type="button"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="hide-scrollbar w-full overflow-visible lg:overflow-x-auto"
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
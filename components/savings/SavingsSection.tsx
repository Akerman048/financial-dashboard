"use client";

import { useEffect, useState } from "react";
import { SavingsGoal } from "@/types/savings.types";
import { useSavingStore } from "@/store/savings.store";
import { useAuthStore } from "@/store/auth.store";
import { mockSavingsGoals } from "@/data/mockSavingsGoals";
import { getUserSavings } from "@/lib/firebase/savings";

import SavingsGoalForm from "./SavingsGoalForm";
import SavingsGoalsList from "./SavingsGoalList";
import SavingsCalculatorCard from "./SavingsCalculatorCard";
import SavingsTrendChart from "./SavingsTrendChart";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function SavingsSection() {
  const user = useAuthStore((state) => state.user);
  const setSavings = useSavingStore((state) => state.setSavings);

  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);
  const [isLoadingSavings, setIsLoadingSavings] = useState(false);

  const clearEditing = () => setGoalToEdit(null);

  useEffect(() => {
    const loadSavings = async () => {
      if (!user) {
        setSavings(mockSavingsGoals);
        setIsLoadingSavings(false);
        return;
      }

      try {
        setIsLoadingSavings(true);
        const userSavings = await getUserSavings(user.uid);
        setSavings(userSavings);
      } catch (error) {
        console.error("Failed to load savings:", error);
      } finally {
        setIsLoadingSavings(false);
      }
    };

    loadSavings();
  }, [user, setSavings]);

  useEffect(() => {
    if (!user) {
      setGoalToEdit(null);
    }
  }, [user]);

  return (
    <section className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-10">
      <div className="lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-6 lg:min-h-0">
        <DashboardCard className="h-full" contentClassName="h-full">
          <SavingsGoalsList onEdit={setGoalToEdit} user={user} />
        </DashboardCard>
      </div>

      <div className="lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-6 lg:min-h-0">
        <DashboardCard
          title={goalToEdit ? "Edit savings goal" : "Create savings goal"}
          className="h-full"
          contentClassName="h-full"
        >
          <SavingsGoalForm
            user={user}
            goalToEdit={goalToEdit}
            clearEditing={clearEditing}
          />
        </DashboardCard>
      </div>

      <div className="lg:col-start-1 lg:col-end-9 lg:row-start-6 lg:row-end-11 lg:min-h-0">
        <DashboardCard className="h-full" contentClassName="h-full">
          <SavingsTrendChart />
        </DashboardCard>
      </div>

      <div className="lg:col-start-9 lg:col-end-13 lg:row-start-6 lg:row-end-11 lg:min-h-0">
        <DashboardCard
          title="Savings calculator"
          className="h-full"
          contentClassName="h-full"
        >
          <SavingsCalculatorCard />
        </DashboardCard>
      </div>

      {isLoadingSavings && (
        <div className="lg:col-span-12 text-sm opacity-70">
          Loading savings...
        </div>
      )}
    </section>
  );
}
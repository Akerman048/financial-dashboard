"use client";

import { useState } from "react";
import { SavingsGoal } from "@/types/savings.types";
import SavingsGoalForm from "./SavingsGoalForm";
import SavingsGoalsList from "./SavingsGoalList";
import SavingsCalculatorCard from "./SavingsCalculatorCard";
import SavingsTrendChart from "./SavingsTrendChart";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function SavingsSection() {
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);

  const clearEditing = () => setGoalToEdit(null);

  return (
    <section className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-10">
      <div className="lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-6 lg:min-h-0">
        <DashboardCard className="h-full" contentClassName="h-full">
          <SavingsGoalsList onEdit={setGoalToEdit} />
        </DashboardCard>
      </div>

      <div className="lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-6 lg:min-h-0">
        <DashboardCard
          title={goalToEdit ? "Edit savings goal" : "Create savings goal"}
          className="h-full"
          contentClassName="h-full"
        >
          <SavingsGoalForm
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
    </section>
  );
}
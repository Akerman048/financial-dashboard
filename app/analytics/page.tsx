import ExpensesAnalyticsChart from "@/components/analytics/ExpensesAnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import React from "react";

export default function Analytics() {
  return <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-10">
     <div className="lg:col-start-1 lg:col-end-7 lg:row-start-6 lg:row-end-11">
             <DashboardCard title="Expenses analytics">
              <ExpensesAnalyticsChart/>
             </DashboardCard>
           </div>
      </div>;
}

import ExpensesAnalyticsChart from "@/components/analytics/ExpensesAnalyticsChart";
import SavingsGaugeChart from "@/components/analytics/SavingsGaugeChart";
import CashflowChart from "@/components/dashboard/CashflowCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import OverviewStats from "@/components/dashboard/OverviewStats";

export default function Analytics() {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-10">

       <div className="lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-6">
              <DashboardCard title="Money Cashflow">
                <CashflowChart />
              </DashboardCard>
            </div>
      
            <div className="lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-6">
              <DashboardCard
                  title="Overview"
                  contentClassName="min-h-0 overflow-y-auto scrollbar-thin"
                >
                  <OverviewStats />
                </DashboardCard>
            </div>
      <div className="lg:col-start-1 lg:col-end-8 lg:row-start-6 lg:row-end-11">
        <DashboardCard title="Expenses analytics">
          <ExpensesAnalyticsChart />
        </DashboardCard>
      </div>
      <div className="lg:col-start-8 lg:col-end-13 lg:row-start-6 lg:row-end-11">
        <DashboardCard title="Saved">
          <SavingsGaugeChart />
        </DashboardCard>
      </div>
    </div>
  );
}

import CashflowChart from "@/components/dashboard/CashflowCard";
import CategoryBreakdownChart from "@/components/dashboard/CategoryBreakdownChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import OverviewStats from "@/components/dashboard/OverviewStats";
import TransactionsList from "@/components/transactions/TransactionsList";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-10">
      <div className="lg:col-start-1 lg:col-end-9 lg:row-start-1 lg:row-end-5">
        <DashboardCard title="Money Cashflow">
          <CashflowChart />
        </DashboardCard>
      </div>

     <div className="lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-end-5 lg:min-h-0">
  <DashboardCard
    title="Overview"
    contentClassName="min-h-0 overflow-y-auto scrollbar-thin"
  >
    <OverviewStats />
  </DashboardCard>
</div>

      <div className="lg:col-start-1 lg:col-end-4 lg:row-start-5 lg:row-end-11 lg:min-h-0">
        <DashboardCard
          title="Category Breakdown"
          actionHref="/analytics"
          actionLabel="Open analytics"
          contentClassName="flex h-full items-center justify-center"
        >
          <CategoryBreakdownChart />
        </DashboardCard>
      </div>

      <div className="lg:col-start-4 lg:col-end-13 lg:row-start-5 lg:row-end-11 lg:min-h-0">
        <DashboardCard title="Transactions" contentClassName="min-h-0 flex-1">
          <TransactionsList
            limit={6}
            showPagination={false}
            showActions={false}
            showViewAllLink={true} user={null}          />
        </DashboardCard>
      </div>
    </div>
  );
}
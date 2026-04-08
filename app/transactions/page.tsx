import TransactionsSection from "@/components/transactions/TransactionsSection";

export default function Transactions() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="min-h-0 min-w-0 flex-1">
        <TransactionsSection />
      </div>
    </div>
  );
}
import TransactionsSection from "@/components/transactions/TransactionsSection";

export default function Transactions() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="min-w-0 flex-1 min-h-0">
        <TransactionsSection />
      </div>
    </div>
  );
}
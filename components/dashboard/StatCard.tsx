type StatCardProps = {
  label: string;
  value: string;
  change?: string;
};

export default function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {change && <p className="mt-2 text-sm text-green-400">{change}</p>}
    </div>
  );
}
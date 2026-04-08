import clsx from "clsx";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  tone?: "positive" | "negative" | "neutral";
};

export default function StatCard({
  label,
  value,
  change,
  tone = "neutral",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="mt-1 text-xl font-bold tracking-tight text-foreground xl:text-[1.35rem]">
        {value}
      </p>

      {change && (
        <p
          className={clsx(
            "mt-2 inline-flex max-w-full rounded-full px-2 py-0.5 text-[11px] font-medium",
            {
              "bg-[var(--success-soft)] text-[var(--success)]":
                tone === "positive",
              "bg-[var(--danger-soft)] text-[var(--danger)]":
                tone === "negative",
              "bg-muted text-muted-foreground": tone === "neutral",
            }
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

type DashboardCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function DashboardCard({
  title,
  children,
  className,
  contentClassName,
  actionHref,
  actionLabel,
}: DashboardCardProps) {
  return (
    <section
      className={clsx(
        "flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]",
        className
      )}
    >
      {(title || actionHref) && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-4">
          {title ? (
            <h2 className="truncate text-lg font-semibold text-foreground">
              {title}
            </h2>
          ) : (
            <div />
          )}

          {actionHref && (
            <Link
              href={actionHref}
              aria-label={actionLabel ?? "Open"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-foreground transition hover:bg-[var(--color-hover)]"
            >
              <span className="text-sm">→</span>
            </Link>
          )}
        </div>
      )}

      <div className={clsx("min-h-0 min-w-0 flex-1 p-4", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
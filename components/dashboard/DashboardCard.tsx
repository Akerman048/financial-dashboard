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
        "flex h-full min-w-0 flex-col rounded-2xl border border-white/10 bg-surface/70 p-4",
        className
      )}
    >
      {(title || actionHref) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : <div />}

          {actionHref && (
            <Link
              href={actionHref}
              aria-label={actionLabel ?? "Open"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition hover:bg-white/5"
            >
              <span className="text-lg leading-none">→</span>
            </Link>
          )}
        </div>
      )}

      <div className={clsx("min-h-0 flex-1", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
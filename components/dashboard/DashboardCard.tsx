import { ReactNode } from "react";
import clsx from "clsx";

type DashboardCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
   <section
  className={clsx(
    "flex h-full min-w-0 flex-col rounded-2xl border border-white/10 bg-surface/70 p-4",
    className
  )}
>
  {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}

  <div className="min-h-0 flex-1">
    {children}
  </div>
</section>
  );
}
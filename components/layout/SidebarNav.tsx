"use client";

import { usePathname } from "next/navigation";
import navigation from "@/config/navigation";
import clsx from "clsx";
import Link from "next/link";

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <ul className="flex w-full flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "group flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:bg-[var(--color-hover)] hover:text-foreground active:scale-[0.98]",
                isActive &&
                  "border border-border bg-[var(--color-active)] text-foreground shadow-[var(--shadow-soft)]"
              )}
            >
              <Icon className="text-lg" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
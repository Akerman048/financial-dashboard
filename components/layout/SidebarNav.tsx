"use client";

import { usePathname } from "next/navigation";
import navigation from "@/config/navigation";
import clsx from "clsx";
import Link from "next/link";

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <ul
      className={clsx(
        "flex flex-col gap-8  ",
        "w-full my-auto",
        
      )}
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "group flex items-center gap-5 rounded-xl px-3 py-2",
                "transition-all duration-200",

                // default
                "text-foreground/70",

                // hover
                "hover:bg-[var(--color-hover)] hover:text-foreground",

                // click
                "active:scale-[0.97]",

                // active route
                isActive &&
                  "bg-[var(--color-active)] text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[var(--color-border-subtle)]",
              )}
            >
              <Icon />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

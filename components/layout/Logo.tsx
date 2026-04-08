"use client";

import clsx from "clsx";
import Image from "next/image";

export default function Logo() {
  return (
    <div
      className={clsx("flex w-full items-center gap-3 rounded-2xl px-3 py-2")}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted shadow-[var(--shadow-soft)] transition-transform duration-300 hover:scale-105">
        <Image
          src="/logo.png"
          alt="Money Stack logo"
          width={28}
          height={28}
          unoptimized
          className="object-contain animate-float drop-shadow-[0_4px_12px_rgba(34,197,94,0.4)]"
        />
      </div>

      <div className="min-w-0">
        <span className="block truncate text-lg font-semibold text-foreground">
          Money stack
        </span>
      </div>
    </div>
  );
}

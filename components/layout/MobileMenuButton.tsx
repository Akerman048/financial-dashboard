"use client";

import clsx from "clsx";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useSidebarStore } from "@/store/sidebar.store";

export default function MobileMenuButton() {
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  return (
    <button
      type="button"
      onClick={openSidebar}
      className={clsx(
        "inline-flex rounded-lg p-2 transition hover:bg-[var(--color-hover)]",
        "lg:hidden",
      )}
      aria-label="Open sidebar"
    >
      <HiOutlineMenuAlt3 className="text-3xl" />
    </button>
  );
}

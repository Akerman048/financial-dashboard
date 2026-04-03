"use client";

import clsx from "clsx";
import { useSidebarStore } from "@/store/sidebar.store";
import SidebarContent from "./SidebarContent";

export default function MobileSidebar() {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  if (!isSidebarOpen) return null;

  return (
    <div
      onClick={closeSidebar}
      className={clsx("fixed inset-0 z-50 bg-black/50 lg:hidden")}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "h-full w-[90%] max-w-[360px]",
          "bg-background p-3 shadow-2xl",
        )}
      >
        <SidebarContent showCloseButton onClose={closeSidebar} />
      </aside>
    </div>
  );
}

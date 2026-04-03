import clsx from "clsx";
import SidebarContent from "./SidebarContent";

export default function DesktopSidebar() {
  return (
    <aside className={clsx("hidden lg:flex", "lg:w-[260px] lg:flex-col")}>
      <SidebarContent />
    </aside>
  );
}

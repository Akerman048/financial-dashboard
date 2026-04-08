import clsx from "clsx";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import SidebarNav from "./SidebarNav";
import ThemeToggle from "./ThemeToggle";
import { IoCloseSharp } from "react-icons/io5";

export default function Sidebar() {
  return (
    <aside
      className={clsx(
        "mx-auto flex w-[90%] flex-col bg-background p-3"
      )}
    >
      <div className="flex items-center justify-between">
        <Logo />

        <IoCloseSharp
          className={clsx(
            "fixed right-3 top-3 text-5xl cursor-pointer text-foreground transition hover:text-foreground/80 sm:hidden"
          )}
        />
      </div>

      <UserMenu />

      <div
        className={clsx(
          "my-auto rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-soft)]"
        )}
      >
        <SidebarNav />
        <ThemeToggle />
      </div>
    </aside>
  );
}
import React from "react";
import clsx from "clsx";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

import SidebarNav from "./SidebarNav";
import ThemeToggle from "./ThemeToggle";

import { IoCloseSharp } from "react-icons/io5";

export default function Sidebar() {
  return (
    <aside
      className={clsx("flex flex-col mx-auto ", "bg-background", "w-[90%]")}
    >
      <div className="flex items-center justify-between">
        <Logo />{" "}
        {
          <IoCloseSharp
            className={clsx(
              "fixed right-3 top-3",
              "text-5xl cursor-pointer",
              "hover:bg-[var(--color-hover)] hover:text-foreground",
              "sm:hidden",
            )}
          />
        }
      </div>
      <div
        className={clsx(
          "my-auto bg-surface p-3",
          "bg-surface/70 backdrop-blur-md shadow-xl border border-white/10",
          "rounded-2xl",
        )}
      >
        <SidebarNav />
        <ThemeToggle />
      </div>
      <UserMenu />
    </aside>
  );
}

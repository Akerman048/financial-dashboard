import clsx from "clsx";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import SidebarNav from "./SidebarNav";
import ThemeToggle from "./ThemeToggle";
import { IoCloseSharp } from "react-icons/io5";
import LoginLogoutBtn from "./LoginLogoutBtn";

type SidebarContentProps = {
  showCloseButton?: boolean;
  onClose?: () => void;
};

export default function SidebarContent({
  showCloseButton = false,
  onClose,
}: SidebarContentProps) {
  return (
    <div className={clsx("flex h-full min-h-0 flex-col bg-background p-3")}>
      <div className="flex items-center justify-between gap-3">
        <Logo />

        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className={clsx(
              "rounded-xl border border-border bg-muted p-2 text-foreground transition hover:bg-[var(--color-hover)] lg:hidden"
            )}
            aria-label="Close sidebar"
          >
            <IoCloseSharp className="text-2xl" />
          </button>
        ) : null}
      </div>

      <div className="mt-3">
        <UserMenu />
      </div>

      <div
        className={clsx(
          "my-4 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-soft)]"
        )}
      >
        <SidebarNav />
        <ThemeToggle />
      </div>

      <LoginLogoutBtn />
    </div>
  );
}
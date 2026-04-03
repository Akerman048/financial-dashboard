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
    <div className={clsx("flex h-full flex-col bg-background p-3")}>
      <div className="flex items-center justify-between">
        <Logo />

        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className={clsx(
              "rounded-lg p-1 transition hover:bg-[var(--color-hover)]",
              "lg:hidden",
            )}
            aria-label="Close sidebar"
          >
            <IoCloseSharp className="text-4xl" />
          </button>
        ) : null}
      </div>
      <UserMenu />
      <div
        className={clsx(
          "my-auto rounded-2xl border border-white/10 bg-surface p-3",
          "bg-surface/70 shadow-xl backdrop-blur-md",
        )}
      >
        <SidebarNav />
        <ThemeToggle />
      </div>

      <LoginLogoutBtn />
    </div>
  );
}

import clsx from "clsx";
import { GiMoneyStack } from "react-icons/gi";

export default function Logo() {
  return (
    <div
      className={clsx(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2"
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-foreground shadow-[var(--shadow-soft)]">
        <GiMoneyStack className="text-2xl animate-float" />
      </div>

      <div className="min-w-0">
        <span className="block truncate text-lg font-semibold text-foreground">
          Money stack
        </span>
      </div>
    </div>
  );
}
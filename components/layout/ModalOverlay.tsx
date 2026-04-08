"use client";

import { useAuthStore } from "@/store/auth.store";
import clsx from "clsx";
import { IoCloseSharp } from "react-icons/io5";

export default function ModalOverlay({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const closeModal = useAuthStore((state) => state.closeAuthModal);

  if (!isModalOpen) return null;

  return (
    <div
      onClick={closeModal}
      className={clsx(
        "fixed inset-0 z-[100]",
        "flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm"
      )}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close modal"
          className={clsx(
            "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition",
            "hover:bg-[var(--color-hover)]"
          )}
        >
          <IoCloseSharp className="text-2xl" />
        </button>

        {children}
      </div>
    </div>
  );
}
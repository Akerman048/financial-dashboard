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
        "bg-gray-600/80"
      )}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <IoCloseSharp
          onClick={closeModal}
          className={clsx(
            "fixed right-3 top-3",
            "text-5xl cursor-pointer",
            "hover:bg-[var(--color-hover)] hover:text-foreground"
          )}
        />
        {children}
      </div>
    </div>
  );
}
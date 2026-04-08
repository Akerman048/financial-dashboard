"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { IoLogOutOutline, IoLogInOutline } from "react-icons/io5";
import { useAuthStore } from "@/store/auth.store";

export default function LoginLogoutBtn() {
  const [user, setUser] = useState<User | null>(null);

  const openModal = useAuthStore((state) => state.openAuthModal);

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-auto w-full rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-soft)]">
      {user ? (
        <button
          type="button"
          onClick={handleLogout}
          className={clsx(
            "group flex w-full items-center justify-between rounded-xl border border-border bg-muted px-3 py-2.5 text-sm font-medium text-foreground transition",
            "hover:bg-[var(--color-hover)] active:scale-[0.98]"
          )}
        >
          <span>Log out</span>
          <IoLogOutOutline className="text-xl" />
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className={clsx(
            "group flex w-full items-center justify-between rounded-xl border border-border bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition",
            "hover:opacity-90 active:scale-[0.98]"
          )}
        >
          <span>Log in</span>
          <IoLogInOutline className="text-xl" />
        </button>
      )}
    </div>
  );
}
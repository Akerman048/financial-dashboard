"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { IoLogOutOutline } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { useAuthStore } from "@/store/auth.store";

export default function LoginLogoutBtn() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const openModal = useAuthStore((state) => state.openAuthModal);

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("USER:", user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={clsx(
        "flex flex-col gap-8 bg-surface p-3",
        "w-full my-auto",
        "sm:w-36 sm:ml-3 sm:rounded-2xl",
        "bg-surface/70 backdrop-blur-md shadow-xl border border-white/10 rounded-xl",
      )}
    >
      {user ? (
        <button
          onClick={handleLogout}
          className={clsx(
            "group flex items-center justify-between  rounded-xl px-2 py-1 cursor-pointer",
            "transition-all duration-200",

            // default
            "text-foreground/70",

            // hover
            "hover:bg-[var(--color-hover)] hover:text-foreground",

            // click
            "active:scale-[0.98]",

            // active route

            "bg-[var(--color-active)] text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.25)] ",
          )}
        >
          Log out
          <IoLogOutOutline className="text-2xl" />
        </button>
      ) : (
        <button
          onClick={openModal}
          className={clsx(
            "group flex items-center justify-between  rounded-xl px-2 py-1 cursor-pointer",
            "transition-all duration-200",

            // default
            "text-foreground/70",

            // hover
            "hover:bg-[var(--color-hover)] hover:text-foreground",

            // click
            "active:scale-[0.97]",

            // active route

            "bg-[var(--color-active)] text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.25)] ",
          )}
        >
          Log in
          <IoLogInOutline className="text-2xl" />
        </button>
      )}
    </div>
  );
}

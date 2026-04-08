"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useProfileStore } from "@/store/profile.store";

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        className={clsx(
          "w-full rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-soft)]",
        )}
      >
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const displayName =
    profile?.displayName?.trim() || user?.displayName || user?.email || "User";
  const photoURL = profile?.photoURL || user?.photoURL || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={clsx(
        "w-full rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-soft)]",
      )}
    >
      {user ? (
        <div className="flex items-center gap-3">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              Hello, {displayName}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-foreground">Not logged in</p>
          <p className="text-xs text-muted-foreground">
            Sign in to sync your data
          </p>
        </div>
      )}
    </div>
  );
}

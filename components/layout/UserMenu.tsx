"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";



export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);



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
        "sm:w-full  sm:rounded-2xl",
        "bg-surface/70 backdrop-blur-md shadow-xl border border-white/10 rounded-xl",
      )}
    >
      {user ? (
        <div className="flex items-center justify-between">👋 Hello {user.email} </div>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  );
}

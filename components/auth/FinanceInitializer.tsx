"use client";

import { useEffect } from "react";
import { mockTransactions } from "@/data/mockTransactions";
import { getUserTransactions } from "@/lib/firebase/transactions";
import { useAuthStore } from "@/store/auth.store";
import { useFinanceStore } from "@/store/finance.store";

export default function FinanceInitializer() {
  const user = useAuthStore((state) => state.user);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const setTransactions = useFinanceStore((state) => state.setTransactions);

  useEffect(() => {
    if (!authInitialized) return;

    const loadTransactions = async () => {
      if (!user) {
        setTransactions(mockTransactions);
        return;
      }

      try {
        const userTransactions = await getUserTransactions(user.uid);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Failed to load user transactions:", error);
        setTransactions([]);
      }
    };

    loadTransactions();
  }, [user, authInitialized, setTransactions]);

  return null;
}
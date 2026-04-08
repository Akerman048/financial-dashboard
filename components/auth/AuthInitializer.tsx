"use client";

import { useEffect } from "react";
import { listenToAuth } from "@/lib/firebase/auth-listener";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { getUserProfile } from "@/lib/firebase/profile";

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const setProfile = useProfileStore((state) => state.setProfile);
  const clearProfile = useProfileStore((state) => state.clearProfile);

  useEffect(() => {
    const unsubscribe = listenToAuth(async (user) => {
      setUser(user);

      if (!user) {
        clearProfile();

        const hasSeen = sessionStorage.getItem("seenAuthPrompt");
        if (!hasSeen) {
          openAuthModal();
        }

        setAuthInitialized(true);
        return;
      }

      const profile = await getUserProfile(user.uid);
      setProfile(profile);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setAuthInitialized, openAuthModal, setProfile, clearProfile]);

  return null;
}

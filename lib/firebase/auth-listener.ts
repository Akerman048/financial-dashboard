import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { ensureUserProfile } from "@/lib/firebase/profile";

export function listenToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await ensureUserProfile(user);
    }

    callback(user);
  });
}
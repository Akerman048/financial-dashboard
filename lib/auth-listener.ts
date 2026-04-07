import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

export function listenToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
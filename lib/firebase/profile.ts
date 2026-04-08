import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile, User } from "firebase/auth";
import { db } from "@/lib/firebase/firebase";

export type UserProfile = {
  displayName: string;
  photoURL: string;
  currency: string;
  email: string;
  updatedAt?: unknown;
};

export async function ensureUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      displayName: user.displayName ?? "",
      photoURL: user.photoURL ?? "",
      currency: "USD",
      email: user.email ?? "",
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid: string) {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

export async function updateUserSettings(
  user: User,
  data: {
    displayName: string;
    photoURL: string;
    currency: string;
  }
) {
  await updateProfile(user, {
    displayName: data.displayName,
    photoURL: data.photoURL,
  });

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    {
      displayName: data.displayName,
      photoURL: data.photoURL,
      currency: data.currency,
      email: user.email ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
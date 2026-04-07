import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { SavingsGoal } from "@/types/savings.types";

function getSavingsCollection(uid: string) {
  return collection(db, "users", uid, "savingsGoals");
}

export async function getUserSavings(uid: string): Promise<SavingsGoal[]> {
  const savingsRef = getSavingsCollection(uid);
  const q = query(savingsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<SavingsGoal, "id">;

    return {
      id: docSnap.id,
      ...data,
    };
  });
}

export async function createUserSavingsGoal(uid: string, goal: SavingsGoal) {
  const goalRef = doc(db, "users", uid, "savingsGoals", goal.id);

  await setDoc(goalRef, {
    title: goal.title,
    category: goal.category,
    color: goal.color,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    createdAt: goal.createdAt,
  });
}

export async function updateUserSavingsGoal(uid: string, goal: SavingsGoal) {
  const goalRef = doc(db, "users", uid, "savingsGoals", goal.id);

  await updateDoc(goalRef, {
    title: goal.title,
    category: goal.category,
    color: goal.color,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
  });
}

export async function deleteUserSavingsGoal(uid: string, goalId: string) {
  const goalRef = doc(db, "users", uid, "savingsGoals", goalId);
  await deleteDoc(goalRef);
}

export async function updateUserSavingsCurrentAmount(
  uid: string,
  goal: SavingsGoal,
  delta: number
) {
  const nextCurrentAmount = Math.max(
    0,
    Math.min(goal.currentAmount + delta, goal.targetAmount)
  );

  const goalRef = doc(db, "users", uid, "savingsGoals", goal.id);

  await updateDoc(goalRef, {
    currentAmount: nextCurrentAmount,
  });

  return {
    ...goal,
    currentAmount: nextCurrentAmount,
  };
}
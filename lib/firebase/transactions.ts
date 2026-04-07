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
import { db } from "@/lib/firebase/firebase";
import { Transaction } from "@/types/transaction.types";

function getTransactionsCollection(uid: string) {
  return collection(db, "users", uid, "transactions");
}

export async function getUserTransactions(uid: string): Promise<Transaction[]> {
  const transactionsRef = getTransactionsCollection(uid);
  const q = query(transactionsRef, orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<Transaction, "id">;

    return {
      id: docSnap.id,
      ...data,
    };
  });
}

export async function createUserTransaction(
  uid: string,
  transaction: Transaction
) {
  const transactionRef = doc(db, "users", uid, "transactions", transaction.id);

  await setDoc(transactionRef, {
    type: transaction.type,
    title: transaction.title,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
  });
}

export async function updateUserTransaction(
  uid: string,
  transaction: Transaction
) {
  const transactionRef = doc(db, "users", uid, "transactions", transaction.id);

  await updateDoc(transactionRef, {
    type: transaction.type,
    title: transaction.title,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
  });
}

export async function deleteUserTransaction(uid: string, transactionId: string) {
  const transactionRef = doc(db, "users", uid, "transactions", transactionId);
  await deleteDoc(transactionRef);
}
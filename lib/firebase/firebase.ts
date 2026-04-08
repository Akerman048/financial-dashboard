import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKj-XBusECvMGlJVELSDsLAhjez3hK7bU",
  authDomain: "financial-dashboard-1ef1e.firebaseapp.com",
  projectId: "financial-dashboard-1ef1e",
  storageBucket: "financial-dashboard-1ef1e.firebasestorage.app",
  messagingSenderId: "566536256142",
  appId: "1:566536256142:web:666a9cde730f035c0f27df",
  measurementId: "G-VRRRTGS6XB",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
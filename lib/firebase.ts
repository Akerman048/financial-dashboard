// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKj-XBusECvMGlJVELSDsLAhjez3hK7bU",
  authDomain: "financial-dashboard-1ef1e.firebaseapp.com",
  projectId: "financial-dashboard-1ef1e",
  storageBucket: "financial-dashboard-1ef1e.firebasestorage.app",
  messagingSenderId: "566536256142",
  appId: "1:566536256142:web:666a9cde730f035c0f27df",
  measurementId: "G-VRRRTGS6XB"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
// const analytics = getAnalytics(app);
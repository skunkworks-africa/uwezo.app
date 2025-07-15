
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj1lusHI8516MOVS22hhe8kEWYQ9IC0Gs",
  authDomain: "wezo-oz0gb.firebaseapp.com",
  projectId: "wezo-oz0gb",
  storageBucket: "wezo-oz0gb.firebasestorage.app",
  messagingSenderId: "883070171885",
  appId: "1:883070171885:web:f03464f9d0d529e143eae4",
  measurementId: "G-GECT9V6674",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);


export { app, auth, storage, db };

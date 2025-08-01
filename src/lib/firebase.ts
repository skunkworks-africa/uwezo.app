
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDj1lusHI8516MOVS22hhe8kEWYQ9IC0Gs",
  authDomain: "wezo-oz0gb.firebaseapp.com",
  projectId: "wezo-oz0gb",
  storageBucket: "wezo-oz0gb.firebasestorage.app",
  messagingSenderId: "883070171885",
  appId: "1:883070171885:web:f03464f9d0d529e143eae4",
  measurementId: "G-GECT9V6674",
  databaseURL: "https://wezo-oz0gb-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);


export { app, auth, storage, db, rtdb };


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


const firebaseConfig = {
  apiKey: "AIzaSyCYaNKjGZ7f0CyqDWbaNlVb2NOegkiCwBw",
  authDomain: "uwezo-f0cbb.firebaseapp.com",
  databaseURL: "https://uwezo-f0cbb-default-rtdb.firebaseio.com",
  projectId: "uwezo-f0cbb",
  storageBucket: "uwezo-f0cbb.firebasestorage.app",
  messagingSenderId: "269343574586",
  appId: "1:269343574586:web:d591f1ee07301669dc8303",
  measurementId: "G-C23QTTCDFT"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);



// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.


export { app, auth, storage, db, rtdb };

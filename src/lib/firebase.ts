import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDetSC-XZFKwgNNjFh7Fr81wQ85aEddPhg",
  authDomain: "tuneify-79bbe.firebaseapp.com",
  projectId: "tuneify-79bbe",
  storageBucket: "tuneify-79bbe.firebasestorage.app",
  messagingSenderId: "798018047544",
  appId: "1:798018047544:web:1d6558c0b1e0f67d4260cd",
  measurementId: "G-M2PG2SNYPT"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };

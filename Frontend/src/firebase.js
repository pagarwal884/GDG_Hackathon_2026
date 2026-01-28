// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEcwj3t-hTPZlS8LIjTeTXWXN-Gt66ubI",
  authDomain: "gdg-hackathon-2026.firebaseapp.com",
  databaseURL: "https://gdg-hackathon-2026-default-rtdb.firebaseio.com",
  projectId: "gdg-hackathon-2026",
  storageBucket: "gdg-hackathon-2026.firebasestorage.app",
  messagingSenderId: "177951224778",
  appId: "1:177951224778:web:460edd013fb66ccff19533",
  measurementId: "G-0MBK41Y4GD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

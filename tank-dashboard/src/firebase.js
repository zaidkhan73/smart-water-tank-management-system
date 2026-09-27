// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Fill these in from Firebase Console → Project settings → General → Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  databaseURL: "https://water-management-system-40a3c-default-rtdb.firebaseio.com",
  projectId: "water-management-system-40a3c",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
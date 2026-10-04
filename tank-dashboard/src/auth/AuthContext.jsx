// src/auth/AuthContext.jsx — Google login + current user
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { ref, update, serverTimestamp } from "firebase/database";
import { auth, provider, db } from "../firebase";
import { ADMIN_EMAILS } from "../config";
import { AuthCtx } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [error, setError] = useState("");

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        // remember the user (needed later for email alerts)
        if (u) {
          update(ref(db, `users/${u.uid}`), {
            email: u.email,
            name: u.displayName || "",
            lastLogin: serverTimestamp(),
          }).catch(() => {});
        }
      }),
    []
  );

  const login = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") setError(e.message);
    }
  };

  const isAdmin = !!user && (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(user.email));

  return (
    <AuthCtx.Provider value={{ user, isAdmin, error, login, logout: () => signOut(auth) }}>
      {children}
    </AuthCtx.Provider>
  );
}

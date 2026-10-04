// src/auth/useAuth.js — context + hook (kept apart from the provider component)
import { createContext, useContext } from "react";

export const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

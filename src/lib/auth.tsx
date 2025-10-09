import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "customer" | "employee";
type User = { email: string; role: Role } | null;

type AuthCtx = {
  user: User;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const KEY = "st:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        console.warn("Failed to parse saved user data");
      }
    }
  }, []);

  // ✅ Save to localStorage when user changes
  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  // ✅ Define login + logout
  const login = (u: NonNullable<User>) => {
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Hook for easy use
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

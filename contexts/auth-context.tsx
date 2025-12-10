"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { AdminType } from "@/types/admin";

interface AuthContextType {
  user: AdminType | null;
  isLoading: boolean;
}
const contextAuth = {
  user: null,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(contextAuth);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/admin");
      const data = await response.json();
      setUser(data.data);
      setIsLoading(false);
    })();
  }, []);

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}

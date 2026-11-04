import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, jsonBody } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/v1/auth/session", { signal: controller.signal })
      .then((result) => setUser(result.user))
      .catch((error) => {
        if (error.status !== 401 && error.name !== "AbortError") {
          console.error("Unable to check the server session.", error);
        }
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: jsonBody({ email, password }),
    });
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (email, password) => {
    const result = await apiRequest("/api/v1/auth/register", {
      method: "POST",
      body: jsonBody({ email, password }),
    });
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/api/v1/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}

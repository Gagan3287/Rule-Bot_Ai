"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosInstance } from "axios";

// API Base URL from env or fallback to local port 8000
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Configure axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("rulebot_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user or default to guest and check F5 reload redirection
  useEffect(() => {
    async function loadUser() {
      if (typeof window !== "undefined") {
        // Redirection on F5 reload: if path is not landing or help docs, redirect back to landing page
        if (window.location.pathname !== "/" && window.location.pathname !== "/how-it-works") {
          router.replace("/");
        }

        const savedToken = localStorage.getItem("rulebot_token");
        const savedUser = localStorage.getItem("rulebot_user");
        const defaultGuestUser = {
          id: "guest-user-id",
          email: "guest@rulebot.local",
          role: "admin", // admin so they can preview analytics
          created_at: new Date().toISOString()
        };

        if (savedToken && savedUser) {
          try {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            
            // Verify token is still valid
            const response = await api.get("/auth/me");
            setUser(response.data);
            localStorage.setItem("rulebot_user", JSON.stringify(response.data));
          } catch (error) {
            console.error("Token verification failed, falling back to guest mode", error);
            setToken("guest-mock-token");
            setUser(defaultGuestUser);
          }
        } else {
          // If no token exists, log in as guest automatically
          setToken("guest-mock-token");
          setUser(defaultGuestUser);
        }
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, user: loggedUser } = response.data;
      
      localStorage.setItem("rulebot_token", access_token);
      localStorage.setItem("rulebot_user", JSON.stringify(loggedUser));
      
      setToken(access_token);
      setUser(loggedUser);
      
      router.push("/chat");
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.detail || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", { email, password });
      const { access_token, user: newUser } = response.data;
      
      localStorage.setItem("rulebot_token", access_token);
      localStorage.setItem("rulebot_user", JSON.stringify(newUser));
      
      setToken(access_token);
      setUser(newUser);
      
      router.push("/chat");
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.detail || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("rulebot_token");
    localStorage.removeItem("rulebot_user");
    // Fall back to a clean guest state
    const defaultGuest = {
      id: "guest-user-id",
      email: "guest@rulebot.local",
      role: "admin",
      created_at: new Date().toISOString()
    };
    setToken("guest-mock-token");
    setUser(defaultGuest);
    router.push("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

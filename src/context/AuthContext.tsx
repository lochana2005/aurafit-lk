"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  fitnessGoal: string;
  memberSince: string;
  avatarInitials: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  fitnessGoal: string;
  password?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "aurafit_auth_v1";

function calculateInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || "AF").toUpperCase();
}

// Default seeded mock user
const DEFAULT_MOCK_USER: UserProfile = {
  id: "usr_aurafit_01",
  name: "Kasun Perera",
  email: "kasun.perera@aurafit.lk",
  phone: "77 123 4567",
  fitnessGoal: "Muscle Gain",
  memberSince: "November 2026",
  avatarInitials: "KP",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_MOCK_USER; // Default seeded active session for immediate luxury experience
    } catch {
      return DEFAULT_MOCK_USER;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to sync auth state with localStorage", e);
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    void _password;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Smooth simulated auth delay

    // If logging in with the default email or any valid email
    const cleanName = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = cleanName
      ? cleanName
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "AuraFit Athlete";

    const loggedInUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: email.toLowerCase().includes("kasun") ? "Kasun Perera" : formattedName,
      email: email.trim().toLowerCase(),
      phone: "77 123 4567",
      fitnessGoal: "Muscle Gain",
      memberSince: "November 2026",
      avatarInitials: calculateInitials(
        email.toLowerCase().includes("kasun") ? "Kasun Perera" : formattedName
      ),
    };

    setUser(loggedInUser);
    setIsLoading(false);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const googleUser: UserProfile = {
      id: "usr_google_kasun",
      name: "Kasun Perera",
      email: "kasun.perera@gmail.com",
      phone: "77 987 6543",
      fitnessGoal: "Strength & Power",
      memberSince: "November 2026",
      avatarInitials: "KP",
    };

    setUser(googleUser);
    setIsLoading(false);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      fitnessGoal: data.fitnessGoal || "Muscle Gain",
      memberSince: "November 2026",
      avatarInitials: calculateInitials(data.name),
    };

    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextName = data.name !== undefined ? data.name : prev.name;
      return {
        ...prev,
        ...data,
        avatarInitials: calculateInitials(nextName),
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

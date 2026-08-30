import { create } from "zustand";
import { apiFetch } from "./api";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  loading: boolean;
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  fetchMe: async () => {
    try {
      const user = await apiFetch<User>("/auth/me");
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  login: async (email, password) => {
    const user = await apiFetch<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    set({ user });
  },
  register: async (name, email, password) => {
    const user = await apiFetch<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    set({ user });
  },
  logout: async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));

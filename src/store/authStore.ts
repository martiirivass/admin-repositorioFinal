import { create } from "zustand";
import { api } from "../shared/api";

interface User {
  id: number;
  nombre: string;
  email: string;
  roles: { codigo: string; nombre: string }[];
}

interface AuthStore {
  user: User | null;
  isLogged: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLogged: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, isLogged: true, isLoading: false });
    } catch {
      set({ user: null, isLogged: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    await api.post("/auth/login", { email, password });
    const { data } = await api.get("/auth/me");
    set({ user: data, isLogged: true });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, isLogged: false });
  },

  hasRole: (role: string) => {
    const { user } = get();
    if (!user) return false;
    return user.roles.some((r) => r.codigo === role || r.codigo === "ADMIN");
  },
}));

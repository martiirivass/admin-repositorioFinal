import { create } from "zustand";
import { authService } from "../features/auth/services/authService";
import type { User } from "../features/auth/services/authService";

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
      const user = await authService.checkAuth();
      set({ user, isLogged: true, isLoading: false });
    } catch {
      set({ user: null, isLogged: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const user = await authService.login(email, password);
    set({ user, isLogged: true });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isLogged: false });
  },

  hasRole: (role: string) => {
    const { user } = get();
    if (!user) return false;
    return user.roles.some((r) => r.codigo === role || r.codigo === "ADMIN");
  },
}));

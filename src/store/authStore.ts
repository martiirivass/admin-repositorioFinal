import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../features/auth/services/authService";
import type { User } from "../features/auth/services/authService";

interface AuthStore {
  user: User | null;
  isLogged: boolean;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLogged: false,
      isLoading: true,
      accessToken: null,

      checkAuth: async () => {
        try {
          const { user, accessToken } = await authService.checkAuth();
          set({ user, isLogged: true, isLoading: false, accessToken });
        } catch {
          set({ user: null, isLogged: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const { user, accessToken } = await authService.login(email, password);
        set({ user, isLogged: true, accessToken });
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isLogged: false, accessToken: null });
      },

      hasRole: (role: string) => {
        const { user } = get();
        if (!user) return false;
        return user.roles.some((r) => r.codigo === role || r.codigo === "ADMIN");
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isLogged: state.isLogged, accessToken: state.accessToken }),
    }
  )
);

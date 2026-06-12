import { api } from "../../../shared/api";

export interface User {
  id: number;
  nombre: string;
  email: string;
  roles: { codigo: string; nombre: string }[];
}

export const authService = {
  checkAuth: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data as User;
  },

  login: async (email: string, password: string): Promise<User> => {
    await api.post("/auth/login", { email, password });
    const { data } = await api.get("/auth/me");
    return data as User;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

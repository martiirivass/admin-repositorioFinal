import { api } from "../../../shared/api";

export interface User {
  id: number;
  nombre: string;
  email: string;
  roles: { codigo: string; nombre: string }[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const authService = {
  checkAuth: async (): Promise<{ user: User; accessToken: string | null }> => {
    const { data } = await api.get("/auth/me");
    const { access_token, ...userData } = data;
    return { user: userData as User, accessToken: access_token ?? null };
  },

  login: async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
    const loginResp = await api.post<LoginResponse>("/auth/login", { email, password });
    const accessToken = loginResp.data.access_token;
    const { data: user } = await api.get<User>("/auth/me");
    return { user, accessToken };
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

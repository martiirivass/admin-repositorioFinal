import { api } from "../../shared/api";
import type { AdminUser } from "../dashboard/types";

export const usuarioService = {
  list: async (params?: { limit?: number; offset?: number; rol_codigo?: string }) => {
    const { data } = await api.get("/admin/usuarios", { params });
    return data as { data: AdminUser[]; total: number };
  },

  delete: async (id: number) => {
    await api.delete(`/admin/usuarios/${id}`);
  },
};

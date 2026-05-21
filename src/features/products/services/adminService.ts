import { api } from "../../../shared/api";
import type { AdminUser } from "../types";

export const adminService = {
  listUsers: async (params?: { limit?: number; offset?: number; rol_id?: number }) => {
    const { data } = await api.get("/admin/usuarios", { params });
    return data as { data: AdminUser[]; total: number };
  },

  deleteUser: async (id: number) => {
    await api.delete(`/admin/usuarios/${id}`);
  },
};

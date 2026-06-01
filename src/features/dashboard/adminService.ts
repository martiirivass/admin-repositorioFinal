import { api } from "../../shared/api";
import type { AdminUser, ResumenStats, VentasSemanalesResponse } from "./types";

export const adminService = {
  listUsers: async (params?: { limit?: number; offset?: number; rol_codigo?: string }) => {
    const { data } = await api.get("/admin/usuarios", { params });
    return data as { data: AdminUser[]; total: number };
  },

  deleteUser: async (id: number) => {
    await api.delete(`/admin/usuarios/${id}`);
  },

  getResumenStats: async () => {
    const { data } = await api.get("/admin/stats/resumen");
    return data as ResumenStats;
  },

  getVentasSemanales: async () => {
    const { data } = await api.get("/admin/stats/ventas-semanales");
    return data as VentasSemanalesResponse;
  },
};

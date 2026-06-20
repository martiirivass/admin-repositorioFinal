import { api } from "../../shared/api";
import type { AdminUser, ResumenStats, VentasSemanalesResponse, PedidosPorEstadoResponse, IngresosPorFormaPagoResponse, ProductosMasVendidosResponse } from "./types";

export const adminService = {
  listUsers: async (params?: { limit?: number; offset?: number; rol_codigo?: string }) => {
    const { data } = await api.get("/admin/usuarios", { params });
    return data as { data: AdminUser[]; total: number };
  },

  deleteUser: async (id: number) => {
    await api.delete(`/admin/usuarios/${id}`);
  },

  getResumenStats: async () => {
    const { data } = await api.get("/estadisticas/resumen");
    return data as ResumenStats;
  },

  getVentasSemanales: async () => {
    const { data } = await api.get("/estadisticas/ventas-semanales");
    return data as VentasSemanalesResponse;
  },

  getPedidosPorEstado: async () => {
    const { data } = await api.get("/estadisticas/pedidos-por-estado");
    return data as PedidosPorEstadoResponse;
  },

  getIngresosPorFormaPago: async () => {
    const { data } = await api.get("/estadisticas/ingresos-por-forma-pago");
    return data as IngresosPorFormaPagoResponse;
  },

  getProductosMasVendidos: async () => {
    const { data } = await api.get("/estadisticas/productos-mas-vendidos", { params: { limit: 10 } });
    return data as ProductosMasVendidosResponse;
  },
};

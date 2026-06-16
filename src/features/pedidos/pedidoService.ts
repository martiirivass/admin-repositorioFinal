import { api } from "../../shared/api";
import type { PedidoReadWithDetalles, AvanceEstadoRequest } from "./types";
import type { EstadoPedidoRead } from "../estado-pedido/types";

export const pedidoService = {
  list: async (params?: { limit?: number; offset?: number; estado_codigo?: string }) => {
    const { data } = await api.get("/pedidos", { params });
    return data as { data: PedidoReadWithDetalles[]; total: number };
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/pedidos/${id}`);
    return data as PedidoReadWithDetalles;
  },

  avanzarEstado: async (id: number, datos: AvanceEstadoRequest) => {
    const { data } = await api.patch(`/pedidos/${id}/estado`, datos);
    return data;
  },

  eliminar: async (id: number) => {
    const { data } = await api.delete(`/pedidos/${id}`);
    return data;
  },

  getHistorial: async (id: number) => {
    const { data } = await api.get(`/pedidos/${id}/historial`);
    return data;
  },

  getEstados: async () => {
    const { data } = await api.get("/estados-pedido");
    return data as EstadoPedidoRead[];
  },
};

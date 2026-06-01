import { api } from "../../shared/api";
import type { PagoRead, PagoCreate } from "./types";

export const pagoService = {
  list: async (params?: { pedido_id?: number }) => {
    const { data } = await api.get("/pagos", { params });
    return data as PagoRead[];
  },

  create: async (payload: PagoCreate) => {
    const { data } = await api.post("/pagos", payload);
    return data as PagoRead;
  },
};

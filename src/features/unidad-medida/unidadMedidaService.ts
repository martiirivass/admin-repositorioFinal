import { api } from "../../shared/api";
import type { UnidadMedidaRead, UnidadMedidaCreate, UnidadMedidaUpdate } from "./types";

export const unidadMedidaService = {
  list: async () => {
    const { data } = await api.get("/unidades-medida");
    return data as UnidadMedidaRead[];
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/unidades-medida/${id}`);
    return data as UnidadMedidaRead;
  },

  create: async (payload: UnidadMedidaCreate) => {
    const { data } = await api.post("/unidades-medida", payload);
    return data as UnidadMedidaRead;
  },

  update: async (id: number, payload: UnidadMedidaUpdate) => {
    const { data } = await api.put(`/unidades-medida/${id}`, payload);
    return data as UnidadMedidaRead;
  },

  delete: async (id: number) => {
    await api.delete(`/unidades-medida/${id}`);
  },
};
